"""
SARAS — Assessment Permissions
"""
from rest_framework.permissions import BasePermission


class IsTestOwnerOrAdmin(BasePermission):
    """
    Allows full access to administrators.
    Allows owners (teachers who created the test) to manage their tests.
    """
    message = 'Only the test creator or an administrator can manage this test.'

    def has_object_permission(self, request, view, obj):
        # Admin has full access
        if getattr(request.user, 'is_admin', False):
            return True
            
        # Creator has access
        return obj.created_by == request.user


class CanTakeTest(BasePermission):
    """
    Students can only take tests that are assigned to their section.
    """
    def has_object_permission(self, request, view, obj):
        if getattr(request.user, 'is_student', False):
            # Check if student's section matches test section
            student_section = getattr(request.user.student_profile, 'section', None)
            return obj.section == student_section
        return True
