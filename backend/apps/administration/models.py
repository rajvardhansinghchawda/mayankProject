import uuid
from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class BulkImportJob(models.Model):
    class ImportType(models.TextChoices):
        STUDENTS = 'students', 'Students'
        TEACHERS = 'teachers', 'Teachers'

    class Status(models.TextChoices):
        QUEUED = 'queued', 'Queued'
        PROCESSING = 'processing', 'Processing'
        COMPLETED = 'completed', 'Completed'
        FAILED = 'failed', 'Failed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bulk_imports')
    import_type = models.CharField(max_length=20, choices=ImportType.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.QUEUED)
    
    total_rows = models.IntegerField(default=0)
    success_rows = models.IntegerField(default=0)
    error_rows = models.IntegerField(default=0)
    last_processed_email = models.CharField(max_length=255, null=True, blank=True)
    error_report = models.JSONField(null=True, blank=True)
    
    celery_task_id = models.CharField(max_length=255, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'bulk_import_jobs'
        ordering = ['-created_at']
