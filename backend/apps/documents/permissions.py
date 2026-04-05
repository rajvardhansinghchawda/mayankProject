"""SARAS — Document Permissions"""
from rest_framework.permissions import BasePermission


class CanViewDocument(BasePermission):
    """Can user view this document's metadata?"""
    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_admin:
            return obj.section.department.institution == user.institution
        if user.is_teacher:
            return user.teacher_profile.assignments.filter(
                section=obj.section, is_active=True
            ).exists()
        if user.is_student:
            return (
                hasattr(user, 'student_profile') and
                user.student_profile.section == obj.section and
                obj.status == 'published'
            )
        return False


class CanUploadDocument(BasePermission):
    """Only students and teachers can upload documents."""
    message = 'Only students and teachers can upload documents.'
    
    def has_permission(self, request, view):
        return request.user.role in ('student', 'teacher')


class IsDocumentOwnerOrAdmin(BasePermission):
    """Only document owner or admin can edit/delete."""
    def has_object_permission(self, request, view, obj):
        return obj.uploader == request.user or request.user.is_admin
