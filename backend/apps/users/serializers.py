"""
SARAS — User Serializers
"""
from rest_framework import serializers
from .models import User, StudentProfile, TeacherProfile, Institution, Department, Section


class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = ['id', 'name', 'short_name', 'website', 'logo_url']


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'code', 'description', 'is_active']


class SectionSerializer(serializers.ModelSerializer):
    department_code = serializers.CharField(source='department.code', read_only=True)
    
    class Meta:
        model = Section
        fields = ['id', 'name', 'semester', 'academic_year', 'department_code', 'is_active']


class StudentProfileSerializer(serializers.ModelSerializer):
    section_display = serializers.CharField(source='section.__str__', read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = ['roll_number', 'enrollment_number', 'section', 'section_display', 'phone', 'date_of_birth']


class TeacherProfileSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = TeacherProfile
        fields = ['employee_id', 'department', 'department_name', 'designation', 'phone']


class UserListSerializer(serializers.ModelSerializer):
    """Minimal user serializer for lists."""
    profile_id = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'is_active', 'profile_id', 'created_at']
    
    def get_profile_id(self, obj):
        if obj.is_student and hasattr(obj, 'student_profile'):
            return obj.student_profile.roll_number
        if obj.is_teacher and hasattr(obj, 'teacher_profile'):
            return obj.teacher_profile.employee_id
        return None


class UserDetailSerializer(serializers.ModelSerializer):
    """Detailed user serializer with profile."""
    profile = serializers.SerializerMethodField()
    institution_name = serializers.CharField(source='institution.name', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'full_name', 'role', 'is_active', 'force_password_change',
            'institution', 'institution_name', 'profile', 'created_at', 'updated_at', 'last_login_at'
        ]
    
    def get_profile(self, obj):
        if obj.is_student and hasattr(obj, 'student_profile'):
            return StudentProfileSerializer(obj.student_profile).data
        if obj.is_teacher and hasattr(obj, 'teacher_profile'):
            return TeacherProfileSerializer(obj.teacher_profile).data
        return None


class UserCreateSerializer(serializers.Serializer):
    """Create a new user (admin only)."""
    email = serializers.EmailField()
    full_name = serializers.CharField(max_length=255)
    role = serializers.ChoiceField(choices=User.Role.choices)
    institution_id = serializers.UUIDField(required=False)
    
    # Student-specific fields
    roll_number = serializers.CharField(max_length=50, required=False)
    enrollment_number = serializers.CharField(max_length=50, required=False)
    section_id = serializers.UUIDField(required=False)
    
    # Teacher-specific fields
    employee_id = serializers.CharField(max_length=50, required=False)
    department_id = serializers.UUIDField(required=False)
    designation = serializers.CharField(max_length=100, required=False)
    
    def validate(self, data):
        role = data['role']
        
        if role == User.Role.STUDENT:
            if not data.get('roll_number') or not data.get('enrollment_number'):
                raise serializers.ValidationError('Students require roll_number and enrollment_number')
        
        if role == User.Role.TEACHER:
            if not data.get('employee_id'):
                raise serializers.ValidationError('Teachers require employee_id')
        
        return data
    
    def create(self, validated_data):
        role = validated_data['role']
        
        # Generate default password
        if role == User.Role.STUDENT:
            default_password = validated_data.get('roll_number')
        elif role == User.Role.TEACHER:
            default_password = validated_data.get('employee_id')
        else:
            default_password = 'ChangeMe@2025'
        
        # Create user
        user = User.objects.create_user(
            email=validated_data['email'],
            password=default_password,
            full_name=validated_data['full_name'],
            role=role,
            institution_id=validated_data.get('institution_id'),
            force_password_change=True,
        )
        
        # Create profile
        if role == User.Role.STUDENT:
            StudentProfile.objects.create(
                user=user,
                roll_number=validated_data['roll_number'],
                enrollment_number=validated_data['enrollment_number'],
                section_id=validated_data.get('section_id'),
            )
        elif role == User.Role.TEACHER:
            TeacherProfile.objects.create(
                user=user,
                employee_id=validated_data['employee_id'],
                department_id=validated_data.get('department_id'),
                designation=validated_data.get('designation', ''),
            )
        
        return user
