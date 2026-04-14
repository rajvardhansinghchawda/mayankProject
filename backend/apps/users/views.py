"""
SARAS — User Management Views
"""
from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import User, Institution, Department, Section
from .serializers import (
    UserListSerializer, UserDetailSerializer, UserCreateSerializer,
    UserUpdateSerializer, InstitutionSerializer, DepartmentSerializer, SectionSerializer
)
from .permissions import IsAdminUser


class UserListView(generics.ListAPIView):
    """GET /api/users/ - List all users (admin only)."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = UserListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'is_active']
    search_fields = ['email', 'full_name']
    ordering_fields = ['created_at', 'full_name', 'email']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        if not user.is_admin:
            return User.objects.none()
            
        qs = User.objects.filter(institution=user.institution)
        
        department_id = self.request.query_params.get('department')
        if department_id and department_id != 'all':
            from django.db.models import Q
            qs = qs.filter(
                Q(teacher_profile__department_id=department_id) |
                Q(student_profile__section__department_id=department_id)
            )
        return qs


class UserDetailView(generics.RetrieveAPIView):
    """GET /api/users/{id}/ - Get user details."""
    permission_classes = [IsAuthenticated]
    serializer_class = UserDetailSerializer
    lookup_field = 'id'
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return User.objects.filter(institution=user.institution)
        return User.objects.filter(id=user.id)


class UserCreateView(generics.CreateAPIView):
    """POST /api/users/ - Create new user (admin only)."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = UserCreateSerializer
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        # If institution_id not provided in request, use the admin's own institution
        if not data.get('institution_id'):
            data['institution_id'] = str(request.user.institution_id) if request.user.institution_id else None
        
        serializer = self.get_serializer(data=data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        
        return Response({
            'success': True,
            'message': 'User created successfully',
            'data': UserDetailSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class UserUpdateView(generics.UpdateAPIView):
    """PATCH /api/users/{id}/update/ - Update user (admin only)."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = UserUpdateSerializer
    lookup_field = 'id'
    
    def get_queryset(self):
        return User.objects.filter(institution=self.request.user.institution)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        # Return the detailed serialized user instead of the update payload
        user = self.get_object()
        return Response({
            'success': True,
            'message': 'User updated successfully',
            'data': UserDetailSerializer(user).data
        })


class UserBulkActionView(generics.GenericAPIView):
    """POST /api/users/bulk-action/ - Perform bulk actions like deactivate/delete."""
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        user_ids = request.data.get('user_ids', [])
        action = request.data.get('action') # 'activate', 'deactivate', 'delete'

        if not isinstance(user_ids, list) or not user_ids:
            return Response({'success': False, 'error': 'No users selected.'}, status=status.HTTP_400_BAD_REQUEST)
        
        users_qs = User.objects.filter(institution=request.user.institution, id__in=user_ids)
        affected_count = 0

        if action == 'activate':
            affected_count = users_qs.update(is_active=True)
        elif action == 'deactivate':
            # Don't deactivate yourself
            affected_count = users_qs.exclude(id=request.user.id).update(is_active=False)
        elif action == 'delete':
            # Don't delete yourself
            affected_count, _ = users_qs.exclude(id=request.user.id).delete()
        else:
            return Response({'success': False, 'error': 'Invalid action.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'success': True,
            'message': f'Successfully performed "{action}" on {affected_count} users.'
        })


class UserDeleteView(generics.DestroyAPIView):
    """DELETE /api/users/{id}/ - Permanently delete user (admin only)."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'
    
    def get_queryset(self):
        # Admins can only delete users within their same institution
        return User.objects.filter(institution=self.request.user.institution)



# ============================================================
# INSTITUTION & STRUCTURE VIEWS
# ============================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def departments_list(request):
    """GET /api/users/departments/ - List departments."""
    if request.user.institution:
        departments = Department.objects.filter(
            institution=request.user.institution,
            is_active=True
        )
        serializer = DepartmentSerializer(departments, many=True)
        return Response({'success': True, 'data': serializer.data})
    return Response({'success': True, 'data': []})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sections_list(request):
    """GET /api/users/sections/ - List sections (with optional filters)."""
    department_id = request.query_params.get('department_id')
    mine = request.query_params.get('mine') == 'true'
    
    qs = Section.objects.filter(is_active=True)
    
    # Filter by institution UNLESS it's a superuser (who sees everything)
    if request.user.institution and not request.user.is_superuser:
        qs = qs.filter(department__institution=request.user.institution)

    
    # Filter only to sections where this teacher is assigned if 'mine' is true
    # ADMIN OVERRIDE: Admins always see all institutional sections
    if mine and not request.user.is_admin and hasattr(request.user, 'teacher_profile'):
        assigned_section_ids = request.user.teacher_profile.assignments.values_list('section_id', flat=True)
        qs = qs.filter(id__in=assigned_section_ids)

    elif department_id:
        qs = qs.filter(department_id=department_id)
    
    serializer = SectionSerializer(qs, many=True)
    return Response({'success': True, 'data': serializer.data})



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_profile(request):
    """GET /api/users/profile/ - Get current user's profile."""
    serializer = UserDetailSerializer(request.user)
    return Response({'success': True, 'data': serializer.data})
