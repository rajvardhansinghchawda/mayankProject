import os
import django
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'saras.settings')
django.setup()

from apps.users.models import Institution, Department, Section, User, StudentProfile, TeacherProfile

def run_seed():
    print("Clearing old data...")
    User.objects.all().delete()
    Institution.objects.all().delete()
    
    print("Creating Institution...")
    institution = Institution.objects.create(
        name="Shree Gujarti Samaj BHMS college Indore",
        short_name="MCE",
        address="123 Tech Lane, Knowledge City",
        website="https://www.mayankcollege.edu"
    )

    print("Creating Department...")
    department = Department.objects.create(
        institution=institution,
        name="Computer Science & Engineering",
        code="CSE",
        description="Department of Computer Science"
    )

    print("Creating Section...")
    section = Section.objects.create(
        department=department,
        name="A",
        semester=6,
        academic_year="2024-2025"
    )

    print("Creating Admin User...")
    admin_user = User.objects.create_superuser(
        email="admin@mayankcollege.edu",
        password="Test@123",
        full_name="System Admin",
        institution=institution
    )

    print("Creating Teacher User...")
    teacher_user = User.objects.create_user(
        email="teacher@mayankcollege.edu",
        password="Test@123",
        full_name="Jane Doe",
        role=User.Role.TEACHER,
        institution=institution,
        force_password_change=False
    )
    TeacherProfile.objects.create(
        user=teacher_user,
        employee_id="EMP-1001",
        department=department,
        designation="Assistant Professor",
        phone="9876543210"
    )

    print("Creating Student User...")
    student_user = User.objects.create_user(
        email="student@mayankcollege.edu",
        password="Test@123",
        full_name="Mayank Student",
        role=User.Role.STUDENT,
        institution=institution,
        force_password_change=False
    )
    StudentProfile.objects.create(
        user=student_user,
        roll_number="CSE2024001",
        enrollment_number="ENR-2024-001",
        section=section,
        phone="8765432109"
    )

    print("Seeding complete! ✨")
    print("\n---------------------------------")
    print("      Test Accounts Created      ")
    print("---------------------------------")
    print(f"Admin:   admin@mayankcollege.edu   | pwd: Test@123")
    print(f"Teacher: teacher@mayankcollege.edu | pwd: Test@123")
    print(f"Student: student@mayankcollege.edu | pwd: Test@123")
    print("---------------------------------\n")

if __name__ == '__main__':
    run_seed()
