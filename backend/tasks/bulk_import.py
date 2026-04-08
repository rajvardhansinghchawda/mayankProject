from celery import shared_task
import csv
import os
import uuid
import logging
from concurrent.futures import ThreadPoolExecutor
from django.utils import timezone
from django.contrib.auth import get_user_model
from apps.administration.models import BulkImportJob
from apps.users.models import StudentProfile, TeacherProfile, Department, Section
from django.db import transaction
from django.contrib.auth.hashers import make_password

User = get_user_model()
logger = logging.getLogger('saras.tasks')

@shared_task(name='tasks.process_bulk_import', bind=True)
def process_bulk_import(self, job_id: str, file_path: str = None):
    try:
        job = BulkImportJob.objects.select_related('admin', 'admin__institution').get(id=job_id)
        job.status = BulkImportJob.Status.PROCESSING
        job.celery_task_id = self.request.id
        job.save()

        institution = getattr(job.admin, 'institution', None)
        success_count = 0
        error_count = 0
        errors = []

        if not file_path or not os.path.exists(file_path):
            raise ValueError("CSV file not found.")

        with open(file_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            rows = list(reader)
            total_rows = len(rows)
            job.total_rows = total_rows
            job.save()

            # Pre-fetch Departments and Sections for the institution
            sections_cache = {}
            departments_cache = {}
            if institution:
                sections = Section.objects.filter(department__institution=institution).select_related('department')
                sections_cache = {str(s.id): s for s in sections}
                departments = Department.objects.filter(institution=institution)
                departments_cache = {str(d.id): d for d in departments}

            # Batch size
            BATCH_SIZE = 500
            for start_idx in range(0, total_rows, BATCH_SIZE):
                batch = rows[start_idx : start_idx + BATCH_SIZE]
                
                # 1. Bulk check for existing emails/IDs
                batch_emails = [r.get('email', '').strip().lower() for r in batch if r.get('email')]
                existing_emails = set(User.objects.filter(email__in=batch_emails).values_list('email', flat=True))
                
                # 2. Parallel Hashing
                # We hash in parallel to bypass the sequential bottleneck
                def get_user_data(row_tuple):
                    idx, row = row_tuple
                    try:
                        email = row.get('email', '').strip()
                        full_name = row.get('full_name', '').strip()
                        
                        if not email or not full_name:
                            return None, {"row": idx, "email": email, "message": "Email and full_name required."}
                        
                        if email.lower() in existing_emails:
                            return None, {"row": idx, "email": email, "message": f"Email {email} already exists."}

                        if job.import_type == BulkImportJob.ImportType.STUDENTS:
                            id_val = row.get('roll_number', '').strip()
                            role = User.Role.STUDENT
                            if not id_val: return None, {"row": idx, "email": email, "message": "roll_number required."}
                        else:
                            id_val = row.get('employee_id', '').strip()
                            role = User.Role.TEACHER
                            if not id_val: return None, {"row": idx, "email": email, "message": "employee_id required."}

                        # MANUAL UUID GENERATION - Crucial for bulk_create to link profiles correctly
                        user_id = uuid.uuid4()
                        
                        # Slow hashing happens here in parallel
                        pwd_hash = make_password(id_val)
                        
                        user_obj = User(
                            id=user_id,
                            email=email,
                            password=pwd_hash,
                            full_name=full_name,
                            role=role,
                            institution=institution,
                            force_password_change=True,
                            is_active=True
                        )
                        return (user_obj, row), None
                    except Exception as e:
                        return None, {"row": idx, "email": row.get('email'), "message": str(e)}

                # Use ThreadPool to parallelize make_password calls
                # Max 8-16 workers depends on CPU
                with ThreadPoolExecutor(max_workers=8) as executor:
                    indexed_batch = [(i, row) for i, row in enumerate(batch, start=start_idx + 1)]
                    results = list(executor.map(get_user_data, indexed_batch))

                batch_users = []
                batch_rows_for_profiles = []
                for user_data, error in results:
                    if error:
                        error_count += 1
                        errors.append(error)
                    elif user_data:
                        batch_users.append(user_data[0])
                        batch_rows_for_profiles.append(user_data[1])

                # 3. Bulk Save in DB
                if batch_users:
                    try:
                        with transaction.atomic():
                            # Atomic save for User + Profile
                            # Since we pre-assigned IDs, this works perfectly on all DBs
                            User.objects.bulk_create(batch_users)
                            
                            profiles_to_create = []
                            for idx, user in enumerate(batch_users):
                                r_data = batch_rows_for_profiles[idx]
                                if job.import_type == BulkImportJob.ImportType.STUDENTS:
                                    sec_id = r_data.get('section_id', '').strip()
                                    profiles_to_create.append(StudentProfile(
                                        user=user, # user object has the ID we manually set
                                        roll_number=r_data.get('roll_number', '').strip(),
                                        enrollment_number=r_data.get('enrollment_number', r_data.get('roll_number', '')).strip(),
                                        section=sections_cache.get(sec_id)
                                    ))
                                else:
                                    dept_id = r_data.get('department_id', '').strip()
                                    profiles_to_create.append(TeacherProfile(
                                        user=user,
                                        employee_id=r_data.get('employee_id', '').strip(),
                                        department=departments_cache.get(dept_id),
                                        designation=r_data.get('designation', '')
                                    ))
                            
                            if profiles_to_create:
                                if job.import_type == BulkImportJob.ImportType.STUDENTS:
                                    StudentProfile.objects.bulk_create(profiles_to_create)
                                else:
                                    TeacherProfile.objects.bulk_create(profiles_to_create)
                            
                            success_count += len(batch_users)
                    except Exception as e:
                        logger.error(f"Batch insert failure: {str(e)}")
                        error_count += len(batch_users)
                        errors.append({"row": f"{start_idx+1}-{start_idx+len(batch)}", "message": f"Database batch error: {str(e)}"})

                # Update progress
                job.success_rows = success_count
                job.error_rows = error_count
                job.save()

        # Finalize
        job.success_rows = success_count
        job.error_rows = error_count
        job.error_report = errors
        job.status = BulkImportJob.Status.COMPLETED
        job.completed_at = timezone.now()
        job.save()

        if file_path and os.path.exists(file_path):
            try: os.remove(file_path)
            except: pass

        return f"Completed. Success: {success_count}, Errors: {error_count}"

    except Exception as e:
        logger.error(f"Bulk import failed: {str(e)}")
        if 'job' in locals():
            job.status = BulkImportJob.Status.FAILED
            job.error_report = [{"error": str(e)}]
            job.save()
        return str(e)
