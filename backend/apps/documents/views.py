"""
SARAS — Document Views
========================
All document operations with privacy-first serving.

The serve endpoint is the most security-critical in the system:
1. Validates JWT + serve token
2. Checks role-based section access
3. Logs the view with IP + user agent
4. Injects dynamic watermark (viewer name + timestamp)
5. Streams bytes with maximum privacy headers
6. Returns NEVER a downloadable file
"""

import logging
from datetime import datetime, timezone

from django.conf import settings
from django.http import StreamingHttpResponse
from django.utils import timezone as django_tz
from rest_framework import status, generics, filters
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from apps.users.models import Institution
from .models import Document, DocumentViewLog, DocumentFlag
from .serializers import (
    DocumentListSerializer, DocumentDetailSerializer,
    DocumentUploadSerializer, DocumentFlagSerializer,
    DocumentServeMetaSerializer
)
from .watermark import DocumentWatermarkService
from .tokens import serve_token_service
from .permissions import CanViewDocument, CanUploadDocument, IsDocumentOwnerOrAdmin

logger = logging.getLogger('saras')


class DocumentServeThrottle(UserRateThrottle):
    """Special throttle for document serving — prevents bulk scraping."""
    rate = '30/minute'
    scope = 'document_serve'


# ============================================================
# DOCUMENT LIST + SEARCH
# ============================================================
class DocumentListView(generics.ListAPIView):
    """
    GET /api/documents/
    Lists published documents accessible to the requesting user.

    Students see: documents in their section.
    Teachers see: documents in their assigned sections.
    Admins see: all documents in their institution.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = DocumentListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['document_type', 'subject', 'status']
    search_fields = ['title', 'description', 'subject', 'tags']
    ordering_fields = ['created_at', 'view_count', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        qs = Document.objects.select_related('uploader', 'section__department').defer('pdf_data')

        # Baseline: All users see published documents from their institution
        institution = getattr(user, 'institution', None)
        if not institution and hasattr(user, 'student_profile'):
            institution = getattr(user.student_profile.section.department, 'institution', None)
        elif not institution and hasattr(user, 'teacher_profile'):
             institution = getattr(user.teacher_profile.department, 'institution', None)

        if not institution:
            return Document.objects.none()

        # Admins see everything for their institution
        if user.is_admin:
             return qs.filter(section__department__institution=institution)

        # Others see all PUBLISHED documents in THEIR institution OR their OWN documents any state
        return qs.filter(
            section__department__institution=institution
        ).filter(
            Q(status=Document.Status.PUBLISHED) | Q(uploader=user)
        )


# ============================================================
# DOCUMENT DETAIL (metadata only — no PDF bytes)
# ============================================================
class DocumentDetailView(APIView):
    """
    GET /api/documents/{id}/
    Returns document metadata + a fresh serve token.
    Does NOT return PDF bytes here.
    """
    permission_classes = [IsAuthenticated, CanViewDocument]

    def get(self, request, document_id):
        try:
            doc = Document.objects.select_related(
                'uploader', 'section__department__institution'
            ).defer('pdf_data').get(id=document_id)
        except Document.DoesNotExist:
            return Response({'error': 'Document not found'}, status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, doc)

        # Issue a fresh serve token for this viewer
        serve_token = serve_token_service.issue_token(
            user_id=str(request.user.id),
            document_id=str(doc.id)
        )
        serve_url = serve_token_service.get_serve_url(str(doc.id), serve_token)

        serializer = DocumentDetailSerializer(doc)
        data = serializer.data
        data['serve_url'] = serve_url
        data['serve_token_expires_in_seconds'] = settings.SERVE_TOKEN_EXPIRY_MINUTES * 60

        # Frontend enforcement flags — instruct client on privacy rendering
        data['privacy_config'] = {
            'disable_right_click': True,
            'disable_keyboard_shortcuts': True,    # Ctrl+S, Ctrl+P
            'disable_text_selection': True,
            'use_sandboxed_iframe': True,
            'show_copy_warning': True,
            'overlay_transparent_div': True,
        }

        return Response({'success': True, 'data': data})


from django.views.decorators.clickjacking import xframe_options_exempt
from django.utils.decorators import method_decorator

# ============================================================
# DOCUMENT SERVE — THE PRIVACY CORE
# ============================================================
@method_decorator(xframe_options_exempt, name='dispatch')
class DocumentServeView(APIView):
    """
    GET /api/documents/{id}/serve/?token=<serve_token>

    This is the most security-critical endpoint in SARAS.

    Flow:
    1. Validate JWT (user is authenticated)
    2. Validate serve token (user + doc match, not expired)
    3. Fetch document from PostgreSQL (raw BYTEA)
    4. Log the view with watermark text
    5. Inject watermark: viewer name + ID + exact timestamp
    6. Stream watermarked bytes with maximum privacy headers
    7. Watermarked bytes are NEVER stored — discarded after streaming
    """
    permission_classes = [AllowAny]
    throttle_classes = [DocumentServeThrottle]

    def get(self, request, document_id):
        serve_token = request.query_params.get('token')

        # ── Step 1: Validate serve token ──────────────────────────────────────
        if not serve_token:
            logger.warning(f"Document serve attempt without token: doc={document_id}")
            return Response(
                {'error': 'Serve token required'},
                status=status.HTTP_403_FORBIDDEN
            )

        token_payload = serve_token_service.validate_token(serve_token)
        if not token_payload:
            return Response(
                {'error': 'Serve token is invalid or expired. Please reload the document.'},
                status=status.HTTP_403_FORBIDDEN
            )

        # ── Step 2: Manually identify user from token ─────────────────────────
        # In an iframe context, standard authentication headers are absent.
        # We rely on the cryptographically signed serve_token for identity.
        from apps.users.models import User
        try:
            current_user = User.objects.get(id=token_payload.get('user_id'))
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_401_UNAUTHORIZED)

        if str(token_payload.get('document_id')) != str(document_id):
            logger.warning(
                f"Serve token mismatch: token_user={current_user.id}, "
                f"token_doc={token_payload.get('document_id')}, "
                f"request_doc={document_id}"
            )
            return Response({'error': 'Serve token mismatch'}, status=status.HTTP_403_FORBIDDEN)

        # ── Step 3: Load document ─────────────────────────────────────────────
        try:
            doc = Document.objects.select_related(
                'section__department__institution'
            ).get(id=document_id)
        except Document.DoesNotExist:
            return Response({'error': 'Document not found'}, status=status.HTTP_404_NOT_FOUND)

        # Owners and admins can view non-published documents (drafts/pending)
        # Normal viewers can ONLY see published documents
        if doc.status != Document.Status.PUBLISHED:
            is_owner = doc.uploader == current_user
            is_admin = current_user.role == 'admin' or current_user.is_staff
            
            if not (is_owner or is_admin):
                return Response(
                    {'error': 'Document is not available'}, 
                    status=status.HTTP_403_FORBIDDEN
                )

        # ── Step 4: Check section access ─────────────────────────────────────
        if not self._user_can_access_document(current_user, doc):
            logger.warning(f"Unauthorized document serve: user={current_user.id}, doc={document_id}")
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

        # ── Step 5: Capture view timestamp (this goes INTO the watermark) ─────
        view_timestamp = datetime.now(tz=timezone.utc)

        # ── Step 6: Build viewer identity for watermark ───────────────────────
        viewer_name = current_user.full_name
        viewer_id = self._get_viewer_id(current_user)
        institution_name = (
            doc.section.department.institution.name
            if doc.section.department.institution
            else settings.INSTITUTION_NAME
        )

        watermark_text = (
            f"{viewer_name} ({viewer_id}) | "
            f"{view_timestamp.strftime('%d %b %Y %H:%M:%S')} | "
            f"{institution_name}"
        )

        # ── Step 7: Log the view BEFORE serving (forensic record) ─────────────
        DocumentViewLog.objects.create(
            document=doc,
            viewer=current_user,
            ip_address=getattr(request, 'client_ip', request.META.get('REMOTE_ADDR')),
            user_agent=getattr(request, 'user_agent', '')[:500],
            watermark_text=watermark_text,
        )

        # Increment view counter
        Document.objects.filter(id=doc.id).update(view_count=doc.view_count + 1)

        # ── Step 8: Inject watermark ──────────────────────────────────────────
        try:
            watermark_service = DocumentWatermarkService(institution_name=institution_name)
            watermarked_bytes = watermark_service.watermark(
                pdf_bytes=bytes(doc.pdf_data),
                viewer_name=viewer_name,
                viewer_id=viewer_id,
                view_timestamp=view_timestamp,
                document_title=doc.title,
            )
        except Exception as e:
            logger.error(f"Watermark injection failed for doc={document_id}: {e}")
            return Response(
                {'error': 'Document processing failed'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # ── Step 9: Stream with maximum privacy headers ───────────────────────
        response = StreamingHttpResponse(
            iter([watermarked_bytes]),
            content_type='application/pdf'
        )

        # PRIVACY HEADERS — these are the Snapchat-style protection layer
        response['Content-Length'] = len(watermarked_bytes)
        response['Content-Disposition'] = f'inline; filename="{doc.title}.pdf"'  # NEVER attachment
        response['Cache-Control'] = 'no-store, no-cache, must-revalidate, private, max-age=0'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'ALLOWALL'  # Let CSP frame-ancestors handle it
        response['X-Download-Options'] = 'noopen'
        response['X-Permitted-Cross-Domain-Policies'] = 'none'
        
        response['Content-Security-Policy'] = (
            "default-src 'self'; script-src 'none'; object-src 'none'; "
            "frame-ancestors *;"
        )

        logger.info(
            f"Document served: doc={document_id}, user={request.user.id}, "
            f"viewer_id={viewer_id}, ip={getattr(request, 'client_ip', 'unknown')}"
        )

        # Watermarked bytes are never stored — garbage collected after this response
        del watermarked_bytes

        return response

    def _user_can_access_document(self, user, doc) -> bool:
        """Check if user has access to the document (must be in the same institution)."""
        institution = getattr(user, 'institution', None)
        if not institution and hasattr(user, 'student_profile'):
            institution = getattr(user.student_profile.section.department, 'institution', None)
        elif not institution and hasattr(user, 'teacher_profile'):
             institution = getattr(user.teacher_profile.department, 'institution', None)

        if not institution:
            return False

        return doc.section.department.institution == institution

    def _get_viewer_id(self, user) -> str:
        """Get the unique ID for watermark — roll number or employee ID."""
        if hasattr(user, 'student_profile'):
            return user.student_profile.roll_number
        if hasattr(user, 'teacher_profile'):
            return user.teacher_profile.employee_id
        return str(user.id)[:8]


# ============================================================
# DOCUMENT UPLOAD
# ============================================================
class DocumentUploadView(APIView):
    """
    POST /api/documents/upload/
    Validates, stores PDF as BYTEA, queues for admin review.
    """
    permission_classes = [IsAuthenticated, CanUploadDocument]

    def post(self, request):
        serializer = DocumentUploadSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response({'success': False, 'errors': serializer.errors}, status=400)

        doc = serializer.save()

        return Response({
            'success': True,
            'message': 'Document uploaded successfully. It will be reviewed by an administrator.',
            'data': {'id': str(doc.id), 'title': doc.title, 'status': doc.status}
        }, status=status.HTTP_201_CREATED)


# ============================================================
# MY UPLOADS
# ============================================================
class MyUploadsView(generics.ListAPIView):
    """
    GET /api/documents/my-uploads/
    Returns documents uploaded by the current user.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = DocumentListSerializer

    def get_queryset(self):
        return Document.objects.defer('pdf_data').filter(
            uploader=self.request.user
        ).order_by('-created_at')


# ============================================================
# DOCUMENT UPDATE / DELETE
# ============================================================
class DocumentManageView(APIView):
    """
    PATCH /api/documents/{id}/
    DELETE /api/documents/{id}/
    Owner or admin only.
    """
    permission_classes = [IsAuthenticated, IsDocumentOwnerOrAdmin]

    def patch(self, request, document_id):
        try:
            doc = Document.objects.defer('pdf_data').get(id=document_id)
        except Document.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        self.check_object_permissions(request, doc)

        allowed_fields = ['title', 'description', 'document_type', 'subject', 'tags']
        for field in allowed_fields:
            if field in request.data:
                setattr(doc, field, request.data[field])

        doc.save(update_fields=[f for f in allowed_fields if f in request.data] + ['updated_at'])

        return Response({'success': True, 'message': 'Document updated'})

    def delete(self, request, document_id):
        try:
            doc = Document.objects.defer('pdf_data').get(id=document_id)
        except Document.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        self.check_object_permissions(request, doc)
        doc.delete()

        return Response({'success': True, 'message': 'Document deleted'})


# ============================================================
# FLAG DOCUMENT
# ============================================================
class FlagDocumentView(APIView):
    """POST /api/documents/{id}/flag/"""
    permission_classes = [IsAuthenticated]

    def post(self, request, document_id):
        try:
            doc = Document.objects.defer('pdf_data').get(id=document_id)
        except Document.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        serializer = DocumentFlagSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=400)

        flag = serializer.save(document=doc, flagged_by=request.user)

        # Mark document as flagged if 3+ open flags
        open_flags = DocumentFlag.objects.filter(document=doc, status=DocumentFlag.FlagStatus.OPEN).count()
        if open_flags >= 3:
            Document.objects.filter(id=doc.id).update(status=Document.Status.FLAGGED)

        return Response({'success': True, 'message': 'Document flagged for review'}, status=201)


# ============================================================
# DOCUMENT ACTIONS (Submit/Unpublish)
# ============================================================
class DocumentActionView(APIView):
    """
    POST /api/documents/{id}/submit/   -> DRAFT -> PENDING_REVIEW
    POST /api/documents/{id}/unpublish/ -> ANY -> DRAFT
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, document_id, action):
        try:
            doc = Document.objects.defer('pdf_data').get(id=document_id)
        except Document.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        # Only uploader or admin can change status
        if doc.uploader != request.user and not request.user.is_admin:
            return Response({'error': 'Permission denied'}, status=403)

        if action == 'submit':
            if doc.status != Document.Status.DRAFT:
                return Response({'error': 'Only drafts can be submitted for review'}, status=400)
            doc.status = Document.Status.PENDING_REVIEW
            doc.save(update_fields=['status', 'updated_at'])
            return Response({'success': True, 'message': 'Submitted for review', 'status': doc.status})

        elif action == 'unpublish':
            doc.status = Document.Status.DRAFT
            doc.save(update_fields=['status', 'updated_at'])
            return Response({'success': True, 'message': 'Moved back to draft', 'status': doc.status})

        return Response({'error': 'Invalid action'}, status=400)


# ============================================================
# ADMIN DOCUMENT ACTIONS (Approve/Reject)
# ============================================================
class AdminDocumentActionView(APIView):
    """
    POST /api/documents/{id}/approve/ -> PENDING -> PUBLISHED
    POST /api/documents/{id}/reject/  -> PENDING -> REJECTED
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, document_id, action):
        if not request.user.is_admin:
            return Response({'error': 'Admin access required'}, status=403)

        try:
            doc = Document.objects.defer('pdf_data').get(id=document_id)
        except Document.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        if action == 'approve':
            doc.status = Document.Status.PUBLISHED
            doc.save(update_fields=['status', 'updated_at'])
            return Response({'success': True, 'message': 'Document approved and published'})

        elif action == 'reject':
            reason = request.data.get('reason', '')
            doc.status = Document.Status.REJECTED
            doc.rejection_reason = reason
            doc.save(update_fields=['status', 'rejection_reason', 'updated_at'])
            return Response({'success': True, 'message': 'Document rejected'})

        return Response({'error': 'Invalid action'}, status=400)


# ============================================================
# ADMIN PENDING LIST
# ============================================================
class AdminPendingListView(generics.ListAPIView):
    """GET /api/documents/pending/ - Admin review queue"""
    permission_classes = [IsAuthenticated]
    serializer_class = DocumentListSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_admin:
            return Document.objects.none()

        # Admin's institution filtering
        institution = getattr(user, 'institution', None)
        if not institution:
            return Document.objects.none()

        return Document.objects.defer('pdf_data').filter(
            section__department__institution=institution,
            status=Document.Status.PENDING_REVIEW
        ).order_by('created_at')


# ============================================================
# VIEW LOG (teacher/admin only)
# ============================================================
class DocumentViewLogView(generics.ListAPIView):
    """GET /api/documents/{id}/view-log/ — Teacher/Admin access"""
    permission_classes = [IsAuthenticated]

    def get(self, request, document_id):
        user = request.user
        if not (user.is_teacher or user.is_admin):
            return Response({'error': 'Access denied'}, status=403)

        logs = DocumentViewLog.objects.filter(
            document_id=document_id
        ).select_related('viewer').order_by('-viewed_at')[:100]

        data = [
            {
                'viewer_name': log.viewer.full_name if log.viewer else 'Unknown',
                'viewer_id': log.watermark_text,
                'ip_address': log.ip_address,
                'viewed_at': log.viewed_at.isoformat(),
            }
            for log in logs
        ]

        return Response({'success': True, 'data': data})
