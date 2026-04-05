"""
SARAS — Authentication Views
Login, logout, token refresh, password change with full audit logging
"""
import logging
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.models import LoginAuditLog
from .serializers import SARASTokenObtainPairSerializer, PasswordChangeSerializer

User = get_user_model()
logger = logging.getLogger('saras')


class LoginThrottle(AnonRateThrottle):
    """Strict rate limiting for login attempts."""
    rate = '5/minute'
    scope = 'login'


class SARASLoginView(TokenObtainPairView):
    """
    POST /api/auth/login/
    Custom login with audit logging and force_password_change check.
    """
    serializer_class = SARASTokenObtainPairSerializer
    throttle_classes = [LoginThrottle]
    
    def post(self, request, *args, **kwargs):
        email = request.data.get('email', '')
        
        # Attempt authentication
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Login successful
            user = User.objects.get(email=email)
            
            # Create audit log
            LoginAuditLog.objects.create(
                user=user,
                email_attempted=email,
                event_type=LoginAuditLog.EventType.LOGIN_SUCCESS,
                ip_address=getattr(request, 'client_ip', None),
                user_agent=getattr(request, 'user_agent', ''),
            )
            
            # Update last login
            user.last_login_at = timezone.now()
            user.save(update_fields=['last_login_at'])
            
            logger.info(f"Login success: {email} from {request.client_ip}")
            
            # Wrap response
            return Response({
                'success': True,
                'message': 'Login successful',
                'data': response.data
            })
        else:
            # Login failed
            LoginAuditLog.objects.create(
                user=None,
                email_attempted=email,
                event_type=LoginAuditLog.EventType.LOGIN_FAILURE,
                ip_address=getattr(request, 'client_ip', None),
                user_agent=getattr(request, 'user_agent', ''),
                extra_data={'error': str(response.data)}
            )
            
            logger.warning(f"Login failed: {email} from {request.client_ip}")
        
        return response


class LogoutView(APIView):
    """
    POST /api/auth/logout/
    Blacklist refresh token and create audit log.
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            # Create audit log
            LoginAuditLog.objects.create(
                user=request.user,
                email_attempted=request.user.email,
                event_type=LoginAuditLog.EventType.LOGOUT,
                ip_address=getattr(request, 'client_ip', None),
                user_agent=getattr(request, 'user_agent', ''),
            )
            
            logger.info(f"Logout: {request.user.email}")
            
            return Response({
                'success': True,
                'message': 'Logout successful'
            })
        except Exception as e:
            logger.error(f"Logout error for {request.user.email}: {e}")
            return Response({
                'success': False,
                'error': 'Logout failed'
            }, status=status.HTTP_400_BAD_REQUEST)


class PasswordChangeView(APIView):
    """
    POST /api/auth/password/change/
    Change password (handles both force change and voluntary change).
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        new_password = serializer.validated_data['new_password']
        
        # Validate password strength via Django validators
        from django.contrib.auth.password_validation import validate_password
        try:
            validate_password(new_password, user)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Set new password
        user.set_password(new_password)
        user.force_password_change = False  # Clear force flag
        user.save(update_fields=['password', 'force_password_change'])
        
        # Create audit log
        LoginAuditLog.objects.create(
            user=user,
            email_attempted=user.email,
            event_type=LoginAuditLog.EventType.PASSWORD_CHANGED,
            ip_address=getattr(request, 'client_ip', None),
            user_agent=getattr(request, 'user_agent', ''),
        )
        
        logger.info(f"Password changed: {user.email}")
        
        return Response({
            'success': True,
            'message': 'Password changed successfully. Please login again with your new password.'
        })


class TokenRefreshView(TokenRefreshView):
    """
    POST /api/auth/token/refresh/
    Refresh access token with audit logging.
    """
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Log token refresh
            if request.user.is_authenticated:
                LoginAuditLog.objects.create(
                    user=request.user,
                    email_attempted=request.user.email,
                    event_type=LoginAuditLog.EventType.TOKEN_REFRESH,
                    ip_address=getattr(request, 'client_ip', None),
                    user_agent=getattr(request, 'user_agent', ''),
                )
        
        return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    """
    GET /api/auth/me/
    Returns current user profile data.
    """
    user = request.user
    
    data = {
        'id': str(user.id),
        'email': user.email,
        'full_name': user.full_name,
        'role': user.role,
        'force_password_change': user.force_password_change,
        'is_active': user.is_active,
        'created_at': user.created_at.isoformat(),
    }
    
    # Add role-specific profile
    if user.is_student and hasattr(user, 'student_profile'):
        profile = user.student_profile
        data['profile'] = {
            'roll_number': profile.roll_number,
            'enrollment_number': profile.enrollment_number,
            'section': str(profile.section) if profile.section else None,
            'phone': profile.phone,
        }
    elif user.is_teacher and hasattr(user, 'teacher_profile'):
        profile = user.teacher_profile
        data['profile'] = {
            'employee_id': profile.employee_id,
            'designation': profile.designation,
            'department': str(profile.department) if profile.department else None,
            'phone': profile.phone,
        }
    
    return Response({
        'success': True,
        'data': data
    })
