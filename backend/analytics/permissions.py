from rest_framework.permissions import BasePermission


class IsMinistry(BasePermission):
    """Only users in the 'ministry' group (or superusers) can pass."""

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return user.is_superuser or user.groups.filter(name='ministry').exists()
