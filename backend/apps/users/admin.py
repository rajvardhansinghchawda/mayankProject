"""
SARAS — Users Admin
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    Institution, Department, Section, User, StudentProfile, TeacherProfile,
    TeacherSubjectAssignment, LoginAuditLog, SystemNotification
)


@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = ['name', 'short_name', 'is_active', 'created_at']
    search_fields = ['name', 'short_name']
    list_filter = ['is_active']


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'institution', 'is_active', 'created_at']
    search_fields = ['code', 'name']
    list_filter = ['institution', 'is_active']


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ['name', 'department', 'semester', 'academic_year', 'is_active']
    search_fields = ['name']
    list_filter = ['department', 'semester', 'academic_year', 'is_active']


class StudentProfileInline(admin.StackedInline):
    model = StudentProfile
    can_delete = False
    verbose_name_plural = 'Student Profile'


class TeacherProfileInline(admin.StackedInline):
    model = TeacherProfile
    can_delete = False
    verbose_name_plural = 'Teacher Profile'


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'full_name', 'role', 'is_active', 'force_password_change', 'created_at']
    search_fields = ['email', 'full_name']
    list_filter = ['role', 'is_active', 'force_password_change', 'institution']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'role', 'institution')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'force_password_change')}),
        ('Dates', {'fields': ('last_login_at', 'created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'last_login_at']
    ordering = ['-created_at']
    
    def get_inlines(self, request, obj=None):
        if obj and obj.is_student:
            return [StudentProfileInline]
        elif obj and obj.is_teacher:
            return [TeacherProfileInline]
        return []


@admin.register(TeacherSubjectAssignment)
class TeacherSubjectAssignmentAdmin(admin.ModelAdmin):
    list_display = ['teacher', 'section', 'subject_code', 'subject_name', 'academic_year', 'is_active']
    search_fields = ['subject_code', 'subject_name']
    list_filter = ['academic_year', 'is_active']


@admin.register(LoginAuditLog)
class LoginAuditLogAdmin(admin.ModelAdmin):
    list_display = ['email_attempted', 'event_type', 'ip_address', 'created_at']
    search_fields = ['email_attempted', 'ip_address']
    list_filter = ['event_type', 'created_at']
    readonly_fields = ['user', 'email_attempted', 'event_type', 'ip_address', 'user_agent', 'extra_data', 'created_at']
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False


@admin.register(SystemNotification)
class SystemNotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'notification_type', 'is_read', 'created_at']
    search_fields = ['title', 'message']
    list_filter = ['notification_type', 'is_read', 'created_at']
