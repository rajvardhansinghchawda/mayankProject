"""
SARAS — User Permissions
"""
from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """Only admin users can access."""
    message = 'Only administrators can perform this action.'
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin
