"""
SARAS — Authentication Serializers
Custom JWT serializers with user metadata and force_password_change check
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.users.models import User, StudentProfile


class SARASTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer that includes user metadata.
    Also enforces force_password_change policy.
    """
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['email'] = user.email
        token['full_name'] = user.full_name
        token['role'] = user.role
        token['institution_id'] = str(user.institution.id) if user.institution else None
        token['force_password_change'] = user.force_password_change
        
        # Add role-specific data
        if user.is_student and hasattr(user, 'student_profile'):
            token['roll_number'] = user.student_profile.roll_number
            token['section_id'] = str(user.student_profile.section.id) if user.student_profile.section else None
        elif user.is_teacher and hasattr(user, 'teacher_profile'):
            token['employee_id'] = user.teacher_profile.employee_id
            token['department_id'] = str(user.teacher_profile.department.id) if user.teacher_profile.department else None
        
        return token
    
    def validate(self, attrs):
        # Support both email and student roll-number as login identifier.
        identifier = (attrs.get('email') or attrs.get('identifier') or '').strip()
        if identifier and '@' not in identifier:
            profile = StudentProfile.objects.select_related('user').filter(roll_number=identifier).first()
            if profile:
                attrs['email'] = profile.user.email

        data = super().validate(attrs)
        
        # Add user metadata to response
        user = self.user
        data['user'] = {
            'id': str(user.id),
            'email': user.email,
            'full_name': user.full_name,
            'role': user.role,
            'force_password_change': user.force_password_change,
        }
        
        # Add role-specific profile data
        if user.is_student and hasattr(user, 'student_profile'):
            profile = user.student_profile
            data['user']['profile'] = {
                'roll_number': profile.roll_number,
                'enrollment_number': profile.enrollment_number,
                'section': str(profile.section) if profile.section else None,
                'section_id': str(profile.section.id) if profile.section else None,
            }
        elif user.is_teacher and hasattr(user, 'teacher_profile'):
            profile = user.teacher_profile
            assignments = profile.assignments.all()
            data['user']['profile'] = {
                'employee_id': profile.employee_id,
                'designation': profile.designation,
                'department': str(profile.department) if profile.department else None,
                'department_id': str(profile.department.id) if profile.department else None,
                'assignments': [
                    {
                        'section_id': str(a.section.id),
                        'section_display': str(a.section),
                        'subject_name': a.subject_name
                    } for a in assignments
                ]
            }
        
        return data


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for changing password (force change or voluntary)."""
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    confirm_password = serializers.CharField(required=True, write_only=True)
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value
    
    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        
        # Password strength validation happens via Django validators
        return data


class PasswordResetRequestSerializer(serializers.Serializer):
    """Request password reset via email."""
    identifier = serializers.CharField(required=True)

    def validate_identifier(self, value):
        value = value.strip()
        # Privacy-first flow: do not reveal existence or non-existence.
        return value
