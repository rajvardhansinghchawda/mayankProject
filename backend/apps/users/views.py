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
    InstitutionSerializer, DepartmentSerializer, SectionSerializer
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
        if user.is_admin:
            return User.objects.filter(institution=user.institution)
        return User.objects.none()


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
        serializer = self.get_serializer(data=request.data)
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
    """PATCH /api/users/{id}/ - Update user (admin only)."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = UserDetailSerializer
    lookup_field = 'id'
    
    def get_queryset(self):
        return User.objects.filter(institution=self.request.user.institution)


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
    
    if request.user.institution:
        qs = qs.filter(department__institution=request.user.institution)
    
    # Filter only to sections where this teacher is assigned if 'mine' is true
    if mine and hasattr(request.user, 'teacher_profile'):
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
