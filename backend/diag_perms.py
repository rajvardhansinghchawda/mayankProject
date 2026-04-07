import os
import django
import sys

# Add the current directory to sys.path to find saras module
sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'saras.settings')
django.setup()

from apps.users.models import User
from apps.documents.permissions import CanUploadDocument

print("Checking Teacher Users Roles:")
teachers = User.objects.filter(role='teacher')
print(f"Found {teachers.count()} teachers with role='teacher'")
for t in teachers[:5]:
    print(f"User: {t.email}, Role: {t.role}")
    # Simulate permission check
    perm = CanUploadDocument()
    class MockRequest:
        def __init__(self, user):
            self.user = user
    print(f"  CanUploadDocument: {perm.has_permission(MockRequest(t), None)}")

print("\nChecking all unique roles in DB:")
for role in User.objects.values_list('role', flat=True).distinct():
    print(f"Role: '{role}'")
