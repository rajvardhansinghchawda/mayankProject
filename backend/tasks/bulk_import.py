from celery import shared_task
import csv
import os
from django.utils import timezone
from django.contrib.auth import get_user_model
from apps.administration.models import BulkImportJob
from apps.users.models import StudentProfile, TeacherProfile, Department, Section
from django.db import transaction

User = get_user_model()

@shared_task(name='tasks.process_bulk_import', bind=True)
def process_bulk_import(self, job_id: str, file_path: str = None):
    try:
        job = BulkImportJob.objects.get(id=job_id)
        job.status = BulkImportJob.Status.PROCESSING
        job.celery_task_id = self.request.id
        job.save()

        success_count = 0
        error_count = 0
        errors = []

        if file_path and os.path.exists(file_path):
            with open(file_path, mode='r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                rows = list(reader)
                job.total_rows = len(rows)
                job.save()

                for i, row in enumerate(rows, start=1):
                    try:
                        with transaction.atomic():
                            email = row.get('email')
                            full_name = row.get('full_name')
                            if not email or not full_name:
                                raise ValueError("Email and full_name are required.")
                            
                            if job.import_type == BulkImportJob.ImportType.STUDENTS:
                                roll_number = row.get('roll_number')
                                section_id = row.get('section_id') # Assumed UUID
                                if not roll_number:
                                    raise ValueError("roll_number required for students.")
                                
                                user = User.objects.create_user(
                                    email=email,
                                    password=roll_number,
                                    full_name=full_name,
                                    role=User.Role.STUDENT,
                                    force_password_change=True
                                )
                                StudentProfile.objects.create(
                                    user=user,
                                    roll_number=roll_number,
                                    enrollment_number=row.get('enrollment_number', roll_number),
                                    section_id=section_id
                                )
                            elif job.import_type == BulkImportJob.ImportType.TEACHERS:
                                employee_id = row.get('employee_id')
                                department_id = row.get('department_id') # Assumed UUID
                                if not employee_id:
                                    raise ValueError("employee_id required for teachers.")
                                
                                user = User.objects.create_user(
                                    email=email,
                                    password=employee_id,
                                    full_name=full_name,
                                    role=User.Role.TEACHER,
                                    force_password_change=True
                                )
                                TeacherProfile.objects.create(
                                    user=user,
                                    employee_id=employee_id,
                                    department_id=department_id,
                                    designation=row.get('designation', '')
                                )
                        
                        success_count += 1

                    except Exception as e:
                        error_count += 1
                        errors.append({"row": i, "error": str(e)})

        job.success_rows = success_count
        job.error_rows = error_count
        job.error_report = errors
        job.status = BulkImportJob.Status.COMPLETED
        job.completed_at = timezone.now()
        job.save()

        # Optional clean up of temporary csv file
        if file_path and os.path.exists(file_path):
            os.remove(file_path)

        return f"Job {job_id} completed. Success: {success_count}, Errors: {error_count}"

    except BulkImportJob.DoesNotExist:
        return f"BulkImportJob {job_id} does not exist."
    except Exception as e:
        if 'job' in locals():
            job.status = BulkImportJob.Status.FAILED
            job.save()
        return f"Process failed: {str(e)}"
