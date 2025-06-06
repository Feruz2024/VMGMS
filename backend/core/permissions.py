from rest_framework import permissions
class IsAdminOrServiceAdvisor(permissions.BasePermission):
    """Allows access to Admin or ServiceAdvisor group members."""
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return (
            user.groups.filter(name='Admin').exists() or
            user.groups.filter(name='ServiceAdvisor').exists()
        )

from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """Allow full access to Admins, read-only for others."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.groups.filter(name='Admin').exists()

class IsAdmin(permissions.BasePermission):
    """Allows access only to users in the Admin group."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.groups.filter(name='Admin').exists()

class IsServiceAdvisor(permissions.BasePermission):
    """Allows access only to users in the ServiceAdvisor group."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.groups.filter(name='ServiceAdvisor').exists()

class IsTechnician(permissions.BasePermission):
    """Allows access only to users in the Technician group."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.groups.filter(name='Technician').exists()
