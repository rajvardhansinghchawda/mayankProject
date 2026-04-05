from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.users.models import Institution, Department, Section, StudentProfile, TeacherProfile

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with default institution, department, section, and user accounts'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting database seeding...')

        # 1. Create Institution
        institution, created = Institution.objects.get_or_create(
            short_name='DEMO',
            defaults={
                'name': 'Demo Technical Institute',
                'address': '123 University Drive',
                'website': 'https://demo.edu'
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created Institution: {institution.name}'))

        # 2. Create Department
        dept, created = Department.objects.get_or_create(
            institution=institution,
            code='CSE',
            defaults={
                'name': 'Computer Science and Engineering',
                'description': 'Department of Computer Science and Engineering'
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created Department: {dept.name}'))

        # 3. Create Section
        section, created = Section.objects.get_or_create(
            department=dept,
            name='A',
            semester=6,
            academic_year='2024-2025'
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created Section: {section.name}'))

        # 4. Create Admin Account
        if not User.objects.filter(email='admin@demo.edu').exists():
            admin_user = User.objects.create_superuser(
                email='admin@demo.edu',
                password='AdminPassword123!',
                full_name='System Administrator',
                institution=institution
            )
            self.stdout.write(self.style.SUCCESS(f'Created Admin: {admin_user.email}'))

        # 5. Create Teacher Account
        if not User.objects.filter(email='teacher@demo.edu').exists():
            teacher_user = User.objects.create_user(
                email='teacher@demo.edu',
                password='TeacherPassword123!',
                full_name='Demo Teacher',
                role=User.Role.TEACHER,
                institution=institution,
                force_password_change=False
            )
            TeacherProfile.objects.create(
                user=teacher_user,
                employee_id='T-1001',
                department=dept,
                designation='Assistant Professor'
            )
            self.stdout.write(self.style.SUCCESS(f'Created Teacher: {teacher_user.email}'))

        # 6. Create Student Account
        if not User.objects.filter(email='student@demo.edu').exists():
            student_user = User.objects.create_user(
                email='student@demo.edu',
                password='StudentPassword123!',
                full_name='Demo Student',
                role=User.Role.STUDENT,
                institution=institution,
                force_password_change=False
            )
            StudentProfile.objects.create(
                user=student_user,
                roll_number='S-1001',
                enrollment_number='ENR-1001',
                section=section
            )
            self.stdout.write(self.style.SUCCESS(f'Created Student: {student_user.email}'))

        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))
