"""
SARAS — Notifications Views

GET  /api/notifications/             — list my notifications (personal + broadcast)
POST /api/notifications/             — admin creates announcement
PATCH /api/notifications/:id/read/  — mark single notification as read
POST /api/notifications/read-all/   — mark all as read
DELETE /api/notifications/:id/      — delete notification (admin only)
GET  /api/notifications/unread-count/ — badge count for UI
"""
import logging
from django.utils import timezone
from django.db.models import Q
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.permissions import IsAdminUser
from .models import Notification
from .serializers import NotificationSerializer, NotificationCreateSerializer

logger = logging.getLogger('saras')


class NotificationListView(APIView):
    """
    GET  /api/notifications/  — returns personal + broadcast notifications
    POST /api/notifications/  — admin creates announcement (broadcast or targeted)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        institution = user.institution

        if not institution:
            return Response({'success': True, 'data': [], 'unread_count': 0})

        # Personal notifications + broadcasts for this institution
        qs = Notification.objects.filter(
            institution=institution
        ).filter(
            Q(recipient=user) | Q(recipient__isnull=True)
        ).select_related('sender').order_by('-created_at')

        # Pagination
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 20))
        start = (page - 1) * page_size
        end = start + page_size

        total = qs.count()
        notifications = qs[start:end]

        unread_count = qs.filter(is_read=False).count()

        serializer = NotificationSerializer(notifications, many=True)
        return Response({
            'success': True,
            'count': total,
            'unread_count': unread_count,
            'page': page,
            'page_size': page_size,
            'data': serializer.data,
        })

    def post(self, request):
        # Only admins can create notifications
        if not request.user.is_admin:
            return Response(
                {'error': 'Only administrators can create announcements.'},
                status=status.HTTP_403_FORBIDDEN
            )

        institution = request.user.institution
        if not institution:
            return Response({'error': 'No institution configured.'}, status=400)

        serializer = NotificationCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'errors': serializer.errors}, status=400)

        notification = serializer.save(
            sender=request.user,
            institution=institution
        )

        logger.info(
            f"Notification created: type={notification.notification_type}, "
            f"broadcast={notification.is_broadcast}, "
            f"by={request.user.email}"
        )

        return Response({
            'success': True,
            'message': 'Notification created successfully.',
            'data': NotificationSerializer(notification).data,
        }, status=status.HTTP_201_CREATED)


class NotificationMarkReadView(APIView):
    """PATCH /api/notifications/:id/read/ — mark single notification as read"""
    permission_classes = [IsAuthenticated]

    def patch(self, request, notification_id):
        user = request.user
        institution = user.institution

        try:
            notification = Notification.objects.get(
                id=notification_id,
                institution=institution
            )
        except Notification.DoesNotExist:
            return Response({'error': 'Notification not found.'}, status=404)

        # Only the recipient (or any user for broadcasts) can mark as read
        if notification.recipient and notification.recipient != user:
            return Response({'error': 'Access denied.'}, status=403)

        if not notification.is_read:
            notification.is_read = True
            notification.read_at = timezone.now()
            notification.save(update_fields=['is_read', 'read_at'])

        return Response({'success': True, 'message': 'Marked as read.'})


class NotificationMarkAllReadView(APIView):
    """POST /api/notifications/read-all/ — mark all as read"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        institution = user.institution

        if not institution:
            return Response({'success': True, 'updated': 0})

        updated = Notification.objects.filter(
            institution=institution,
            is_read=False
        ).filter(
            Q(recipient=user) | Q(recipient__isnull=True)
        ).update(is_read=True, read_at=timezone.now())

        return Response({
            'success': True,
            'message': f'{updated} notification(s) marked as read.',
            'updated': updated,
        })


class NotificationDeleteView(APIView):
    """DELETE /api/notifications/:id/ — admin can delete any, users can delete their own"""
    permission_classes = [IsAuthenticated]

    def delete(self, request, notification_id):
        user = request.user
        institution = user.institution

        try:
            notification = Notification.objects.get(
                id=notification_id,
                institution=institution
            )
        except Notification.DoesNotExist:
            return Response({'error': 'Notification not found.'}, status=404)

        # Admins can delete any, others can only delete their own personal ones
        if not user.is_admin:
            if notification.recipient != user:
                return Response({'error': 'Access denied.'}, status=403)

        notification.delete()
        return Response({'success': True, 'message': 'Notification deleted.'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_count(request):
    """GET /api/notifications/unread-count/ — for badge in UI"""
    user = request.user
    institution = user.institution

    if not institution:
        return Response({'success': True, 'unread_count': 0})

    count = Notification.objects.filter(
        institution=institution,
        is_read=False
    ).filter(
        Q(recipient=user) | Q(recipient__isnull=True)
    ).count()

    return Response({'success': True, 'unread_count': count})


# ============================================================
# NOTIFICATION SERVICE — used internally by other apps
# ============================================================

class NotificationService:
    """
    Internal service for creating notifications from other apps (Celery tasks, views, etc).
    Usage:
        from apps.notifications.views import NotificationService
        NotificationService.notify_user(user, title="Document Approved", ...)
        NotificationService.broadcast(institution, title="System Maintenance", ...)
    """

    @staticmethod
    def notify_user(
        user,
        title: str,
        body: str = '',
        notification_type: str = Notification.NotificationType.INFO,
        action_url: str = '',
        metadata: dict = None,
        sender=None,
    ) -> Notification:
        """Send a notification to a single user."""
        if not user.institution:
            logger.warning(f"Cannot notify user {user.id} — no institution")
            return None

        return Notification.objects.create(
            recipient=user,
            institution=user.institution,
            title=title,
            body=body,
            notification_type=notification_type,
            action_url=action_url,
            metadata=metadata or {},
            sender=sender,
        )

    @staticmethod
    def broadcast(
        institution,
        title: str,
        body: str = '',
        notification_type: str = Notification.NotificationType.ANNOUNCEMENT,
        action_url: str = '',
        metadata: dict = None,
        sender=None,
    ) -> Notification:
        """Send a broadcast notification to all users in an institution."""
        return Notification.objects.create(
            recipient=None,  # NULL = broadcast
            institution=institution,
            title=title,
            body=body,
            notification_type=notification_type,
            action_url=action_url,
            metadata=metadata or {},
            sender=sender,
        )

    @staticmethod
    def notify_document_status(document, new_status: str, reason: str = ''):
        """Notify uploader when their document status changes."""
        if not document.uploader:
            return

        if new_status == 'published':
            title = f'Your document "{document.title}" has been approved'
            body = 'Your upload is now live and accessible to students.'
            ntype = Notification.NotificationType.DOCUMENT_APPROVED
            action_url = f'/resources/{document.id}'
        elif new_status == 'rejected':
            title = f'Your document "{document.title}" was not approved'
            body = reason or 'Please review the document and re-upload if necessary.'
            ntype = Notification.NotificationType.DOCUMENT_REJECTED
            action_url = f'/uploads'
        else:
            title = f'Document status update: "{document.title}"'
            body = f'Status changed to: {new_status}'
            ntype = Notification.NotificationType.INFO
            action_url = ''

        NotificationService.notify_user(
            user=document.uploader,
            title=title,
            body=body,
            notification_type=ntype,
            action_url=action_url,
            metadata={'document_id': str(document.id)},
        )

    @staticmethod
    def notify_test_results(test):
        """Broadcast to all students in the test's section when results are released."""
        from apps.users.models import User
        section = test.section
        students = User.objects.filter(
            student_profile__section=section,
            is_active=True
        ).select_related('institution')

        for student in students:
            NotificationService.notify_user(
                user=student,
                title=f'Results available: {test.title}',
                body='Your test results are now available. Click to view your score.',
                notification_type=Notification.NotificationType.TEST_RESULTS_RELEASED,
                action_url=f'/tests/{test.id}/result',
                metadata={'test_id': str(test.id)},
            )

        logger.info(f"Result release notifications sent for test={test.id}, section={section}")
