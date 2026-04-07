import csv
import io
from django.db import transaction
from django.contrib.auth import get_user_model
from apps.users.models import StudentProfile, TeacherProfile, Department, Section

User = get_user_model()

class BulkUploadService:
    @staticmethod
    def process_csv(file_obj, role, institution=None):
        """
        Parses a CSV file and bulk creates users and their profiles.
        Returns a dict with 'success_count', 'error_count', and 'errors' list.
        """
        decoded_file = file_obj.read().decode('utf-8')
        reader = csv.DictReader(io.StringIO(decoded_file))
        
        success_count = 0
        errors = []
        row_num = 1
        
        for row in reader:
            row_num += 1
            full_name = row.get('full_name', '').strip()
            email = row.get('email', '').strip()
            
            if not full_name:
                errors.append({"row": row_num, "message": "Missing full_name"})
                continue
            if not email:
                errors.append({"row": row_num, "message": "Missing email"})
                continue
            
            if User.objects.filter(email__iexact=email).exists():
                errors.append({"row": row_num, "email": email, "message": f"Email {email} already exists"})
                continue
            
            try:
                with transaction.atomic():
                    user = User.objects.create_user(
                        email=email,
                        full_name=full_name,
                        role=role,
                        password="Test@123", # Default temporary password
                        institution=institution
                    )
                    user.force_password_change = True
                    user.save()
                    
                    if role == User.Role.STUDENT:
                        roll_number = row.get('roll_number', '').strip()
                        enrollment_number = row.get('enrollment_number', '').strip()
                        section_id = row.get('section_id', '').strip()
                        
                        if not roll_number or not enrollment_number:
                            raise ValueError("Missing roll_number or enrollment_number")
                            
                        section = None
                        if section_id:
                            section = Section.objects.filter(id=section_id).first()
                            if not section:
                                errors.append({"row": row_num, "warning": f"Section ID {section_id} not found."})
                        
                        StudentProfile.objects.create(
                            user=user,
                            roll_number=roll_number,
                            enrollment_number=enrollment_number,
                            section=section
                        )
                        
                    elif role == User.Role.TEACHER:
                        employee_id = row.get('employee_id', '').strip()
                        department_id = row.get('department_id', '').strip()
                        
                        if not employee_id:
                            raise ValueError("Missing employee_id")
                            
                        department = None
                        if department_id:
                            department = Department.objects.filter(id=department_id).first()
                            if not department:
                                errors.append({"row": row_num, "warning": f"Department ID {department_id} not found."})
                            
                        TeacherProfile.objects.create(
                            user=user,
                            employee_id=employee_id,
                            department=department
                        )
                    
                    success_count += 1
            except Exception as e:
                errors.append({"row": row_num, "email": email, "message": str(e)})
        
        return {
            "success_count": success_count,
            "error_count": len(errors),
            "errors": errors
        }
