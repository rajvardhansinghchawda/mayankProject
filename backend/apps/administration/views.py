from rest_framework import views, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from apps.users.models import Department, Section, Institution, LoginAuditLog
from .models import BulkImportJob
from .serializers import CSVUploadSerializer, BulkImportJobSerializer
from apps.users.serializers import DepartmentSerializer, SectionSerializer, InstitutionSerializer
from django.apps import apps

User = get_user_model()

class AdminStatsView(views.APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        total_students = User.objects.filter(role=User.Role.STUDENT).count()
        total_teachers = User.objects.filter(role=User.Role.TEACHER).count()
        
        stats = {
            'total_students': total_students,
            'total_teachers': total_teachers,
        }
        return Response(stats)

class AdminAuditLogView(views.APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        logs = LoginAuditLog.objects.all().order_by('-created_at')[:50]
        data = [{
            'id': log.id,
            'email': log.email_attempted,
            'event': log.event_type,
            'ip': log.ip_address,
            'time': log.created_at
        } for log in logs]
        return Response(data)

class DepartmentAdminViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = DepartmentSerializer
    queryset = Department.objects.all()

class SectionAdminViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = SectionSerializer
    queryset = Section.objects.all()

class AdminSettingsView(views.APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        institution = getattr(request.user, 'institution', None)
        if not institution:
            institution = Institution.objects.first()
        serializer = InstitutionSerializer(institution)
        return Response(serializer.data)

    def put(self, request):
        institution = getattr(request.user, 'institution', None)
        if not institution:
            institution = Institution.objects.first()
        serializer = InstitutionSerializer(institution, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BulkUploadView(views.APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        serializer = CSVUploadSerializer(data=request.data)
        if serializer.is_valid():
            import_type = serializer.validated_data['import_type']
            
            job = BulkImportJob.objects.create(
                admin=request.user,
                import_type=import_type
            )
            # tasks.process_bulk_import.delay(str(job.id))
            
            return Response({'job_id': job.id}, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BulkUploadStatusView(views.APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request, job_id):
        job = get_object_or_404(BulkImportJob, id=job_id)
        serializer = BulkImportJobSerializer(job)
        return Response(serializer.data)

class BulkUploadErrorsView(views.APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request, job_id):
        job = get_object_or_404(BulkImportJob, id=job_id)
        return Response({'error_report': job.error_report or []})

class UserAdminActionView(views.APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    action_type = None

    def post(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        
        if self.action_type == 'reset_password':
            if hasattr(user, 'student_profile'):
                user.set_password(user.student_profile.roll_number)
            else:
                user.set_password('Saras@123')
            user.force_password_change = True
            user.save()
            return Response({'status': 'password_reset'})
            
        elif self.action_type == 'toggle_active':
            user.is_active = not user.is_active
            user.save()
            return Response({'status': 'toggled', 'is_active': user.is_active})
            
        return Response(status=status.HTTP_400_BAD_REQUEST)

class DocumentAdminViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_document_model(self):
        try:
            return apps.get_model('documents', 'Document')
        except LookupError:
            return None

    def list(self, request):
        DocModel = self.get_document_model()
        if not DocModel:
            return Response([])
        docs = DocModel.objects.exclude(is_deleted=True)
        data = [{'id': str(d.id), 'title': d.title, 'status': d.status, 'flag_count': d.flag_count} for d in docs]
        return Response(data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        DocModel = self.get_document_model()
        if not DocModel:
            return Response(status=status.HTTP_404_NOT_FOUND)
        doc = get_object_or_404(DocModel, pk=pk)
        doc.flag_count = 0
        doc.status = 'published'
        doc.save()
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'])
    def remove(self, request, pk=None):
        DocModel = self.get_document_model()
        if not DocModel:
            return Response(status=status.HTTP_404_NOT_FOUND)
        doc = get_object_or_404(DocModel, pk=pk)
        doc.status = 'removed'
        doc.save()
        return Response({'status': 'removed'})

    def destroy(self, request, pk=None):
        DocModel = self.get_document_model()
        if not DocModel:
            return Response(status=status.HTTP_404_NOT_FOUND)
        doc = get_object_or_404(DocModel, pk=pk)
        doc.is_deleted = True
        doc.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
