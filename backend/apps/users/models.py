"""
SARAS — User Models
Institution, Department, Section, User (custom), StudentProfile, TeacherProfile
"""
import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator
from django.utils import timezone


# ============================================================
# INSTITUTION
# ============================================================
class Institution(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    short_name = models.CharField(max_length=50)
    address = models.TextField(blank=True)
    website = models.URLField(blank=True)
    logo_url = models.URLField(blank=True)

    # SMTP config stored encrypted (for email sending)
    smtp_host = models.CharField(max_length=255, blank=True)
    smtp_port = models.IntegerField(default=587)
    smtp_username = models.CharField(max_length=255, blank=True)
    smtp_password = models.CharField(max_length=255, blank=True)  # Encrypted in production
    smtp_use_tls = models.BooleanField(default=True)

    # Security policy settings
    max_tab_switches_before_warning = models.IntegerField(default=3)
    auto_submit_on_fullscreen_exit = models.BooleanField(default=False)
    watermark_opacity = models.FloatField(default=0.3)
    document_serve_token_expiry_minutes = models.IntegerField(default=5)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'institutions'

    def __str__(self):
        return self.name


# ============================================================
# DEPARTMENT
# ============================================================
class Department(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=20)  # e.g., CSE, ECE, MECH
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'departments'
        unique_together = [('institution', 'code')]

    def __str__(self):
        return f"{self.code} — {self.name}"


# ============================================================
# SECTION
# ============================================================
class Section(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='sections')
    name = models.CharField(max_length=10)  # A, B, C etc
    semester = models.IntegerField()
    academic_year = models.CharField(max_length=20)  # e.g., 2024-2025
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'sections'
        unique_together = [('department', 'name', 'semester', 'academic_year')]

    def __str__(self):
        return f"{self.department.code} | Sem {self.semester} | Section {self.name} ({self.academic_year})"


# ============================================================
# CUSTOM USER MANAGER
# ============================================================
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('role', User.Role.ADMIN)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('force_password_change', False)
        return self.create_user(email, password, **extra_fields)


# ============================================================
# USER
# ============================================================
class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        STUDENT = 'student', 'Student'
        TEACHER = 'teacher', 'Teacher'
        ADMIN = 'admin', 'Administrator'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    institution = models.ForeignKey(
        Institution, on_delete=models.CASCADE,
        related_name='users', null=True, blank=True
    )
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT)

    # Account state
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    force_password_change = models.BooleanField(
        default=True,
        help_text='User must change password on next login'
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_at = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'role']

    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role', 'institution']),
        ]

    def __str__(self):
        return f"{self.full_name} ({self.role}) — {self.email}"

    @property
    def is_student(self):
        return self.role == self.Role.STUDENT

    @property
    def is_teacher(self):
        return self.role == self.Role.TEACHER

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN

    def get_display_name(self):
        """Returns name + ID for watermark injection."""
        if hasattr(self, 'student_profile'):
            return f"{self.full_name} ({self.student_profile.roll_number})"
        if hasattr(self, 'teacher_profile'):
            return f"{self.full_name} ({self.teacher_profile.employee_id})"
        return self.full_name


# ============================================================
# STUDENT PROFILE
# ============================================================
class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    roll_number = models.CharField(max_length=50, unique=True)
    enrollment_number = models.CharField(max_length=50, unique=True)
    section = models.ForeignKey(Section, on_delete=models.SET_NULL, null=True, related_name='students')
    phone = models.CharField(max_length=15, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'student_profiles'

    def __str__(self):
        return f"{self.roll_number} — {self.user.full_name}"


# ============================================================
# TEACHER PROFILE
# ============================================================
class TeacherProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher_profile')
    employee_id = models.CharField(max_length=50, unique=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='teachers')
    designation = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'teacher_profiles'

    def __str__(self):
        return f"{self.employee_id} — {self.user.full_name}"


# ============================================================
# TEACHER SUBJECT ASSIGNMENT
# ============================================================
class TeacherSubjectAssignment(models.Model):
    teacher = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE, related_name='assignments')
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='teacher_assignments')
    subject_name = models.CharField(max_length=255)
    subject_code = models.CharField(max_length=50)
    academic_year = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'teacher_subject_assignments'
        unique_together = [('teacher', 'section', 'subject_code', 'academic_year')]

    def __str__(self):
        return f"{self.teacher.employee_id} → {self.subject_code} ({self.section})"


# ============================================================
# LOGIN AUDIT LOG
# ============================================================
class LoginAuditLog(models.Model):
    class EventType(models.TextChoices):
        LOGIN_SUCCESS = 'login_success', 'Login Success'
        LOGIN_FAILURE = 'login_failure', 'Login Failure'
        LOGOUT = 'logout', 'Logout'
        TOKEN_REFRESH = 'token_refresh', 'Token Refresh'
        PASSWORD_CHANGED = 'password_changed', 'Password Changed'
        PASSWORD_RESET = 'password_reset', 'Password Reset'

    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='audit_logs')
    email_attempted = models.EmailField()  # Store even for failed logins
    event_type = models.CharField(max_length=30, choices=EventType.choices)
    ip_address = models.GenericIPAddressField(null=True)
    user_agent = models.TextField(blank=True)
    extra_data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'login_audit_logs'
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['ip_address', '-created_at']),
        ]

    def __str__(self):
        return f"{self.event_type} | {self.email_attempted} | {self.ip_address}"


# ============================================================
# SYSTEM NOTIFICATION
# ============================================================
class SystemNotification(models.Model):
    class NotificationType(models.TextChoices):
        INFO = 'info', 'Info'
        SUCCESS = 'success', 'Success'
        WARNING = 'warning', 'Warning'
        ERROR = 'error', 'Error'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NotificationType.choices, default=NotificationType.INFO)
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    action_url = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'system_notifications'
        ordering = ['-created_at']
