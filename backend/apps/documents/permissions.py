"""SARAS — Document Permissions"""
from rest_framework.permissions import BasePermission


class CanViewDocument(BasePermission):
    """Can user view this document's metadata?"""
    def has_object_permission(self, request, view, obj):
        user = request.user
        
        # Get institutional context for the user
        institution = getattr(user, 'institution', None)
        if not institution and hasattr(user, 'student_profile'):
            institution = getattr(user.student_profile.section.department, 'institution', None)
        elif not institution and hasattr(user, 'teacher_profile'):
             institution = getattr(user.teacher_profile.department, 'institution', None)

        if not institution:
            return False

        # Must be same institution
        if obj.section.department.institution != institution:
            return False

        # Admin can view everything in their institution
        if user.is_admin:
            return True

        # Others can view published documents, OR their own documents in any state
        return obj.status == 'published' or obj.uploader == user


class CanUploadDocument(BasePermission):
    """Only students, teachers, and admins can upload documents."""
    message = 'Only students, teachers, and admins can upload documents.'
    
    def has_permission(self, request, view):
        # Allow authenticated users with student, teacher, or admin roles
        return request.user.role in ('student', 'teacher', 'admin')



class IsDocumentOwnerOrAdmin(BasePermission):
    """Only document owner or admin can edit/delete."""
    def has_object_permission(self, request, view, obj):
        return obj.uploader == request.user or request.user.is_admin
