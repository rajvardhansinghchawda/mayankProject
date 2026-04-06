"""
SARAS — Document Models
PDFs stored as BYTEA in PostgreSQL (no filesystem).
Privacy-first: watermarked on every serve, never downloaded.
"""
import uuid
from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator


# ============================================================
# DOCUMENT
# ============================================================
class Document(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PENDING_REVIEW = 'pending', 'Pending Review'
        PUBLISHED = 'published', 'Published'
        REJECTED = 'rejected', 'Rejected'
        FLAGGED = 'flagged', 'Flagged'

    class DocumentType(models.TextChoices):
        NOTES = 'notes', 'Notes'
        ASSIGNMENT = 'assignment', 'Assignment'
        PROJECT = 'project', 'Project Report'
        LAB = 'lab', 'Lab Documentation'
        PRESENTATION = 'presentation', 'Presentation'
        STUDY_GUIDE = 'study_guide', 'Study Guide'
        OTHER = 'other', 'Other'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    uploader = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL, null=True,
        related_name='uploaded_documents'
    )
    section = models.ForeignKey(
        'users.Section', on_delete=models.CASCADE,
        related_name='documents'
    )

    # Metadata
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    document_type = models.CharField(max_length=30, choices=DocumentType.choices, default=DocumentType.NOTES)
    subject = models.CharField(max_length=255, blank=True)
    tags = models.JSONField(default=list)

    # ─── PRIVACY CORE ─────────────────────────────────────────────────────────
    # PDF stored as raw bytes in PostgreSQL — no filesystem, no S3.
    # This is the only copy. Watermarked version is generated fresh per request.
    pdf_data = models.BinaryField()
    file_size_bytes = models.IntegerField()
    original_filename = models.CharField(max_length=255)
    page_count = models.IntegerField(default=0)
    # ──────────────────────────────────────────────────────────────────────────

    # Status & Moderation
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    rejection_reason = models.TextField(blank=True)
    flag_count = models.IntegerField(default=0)
    is_deleted = models.BooleanField(default=False)

    # Statistics
    view_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'documents'
        indexes = [
            models.Index(fields=['section', 'status']),
            models.Index(fields=['uploader', '-created_at']),
            models.Index(fields=['-created_at']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} | {self.section}"


# ============================================================
# DOCUMENT VIEW LOG
# ============================================================
class DocumentViewLog(models.Model):
    """
    Every document access is logged.
    Combined with watermarking, this creates full forensic accountability.
    """
    id = models.BigAutoField(primary_key=True)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='view_logs')
    viewer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='document_views'
    )
    ip_address = models.GenericIPAddressField(null=True)
    user_agent = models.TextField(blank=True)

    # Watermark snapshot — records exactly what watermark was injected
    watermark_text = models.CharField(max_length=500)

    # This timestamp is injected into the watermark — forensic link
    viewed_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'document_view_logs'
        # BRIN index — efficient for append-only time-series data
        indexes = [
            models.Index(fields=['document', '-viewed_at']),
            models.Index(fields=['viewer', '-viewed_at']),
        ]

    def __str__(self):
        return f"{self.document.title} viewed by {self.viewer} at {self.viewed_at}"


# ============================================================
# DOCUMENT FLAG
# ============================================================
class DocumentFlag(models.Model):
    class FlagReason(models.TextChoices):
        INAPPROPRIATE = 'inappropriate', 'Inappropriate Content'
        COPYRIGHT = 'copyright', 'Copyright Violation'
        WRONG_SUBJECT = 'wrong_subject', 'Wrong Subject/Section'
        DUPLICATE = 'duplicate', 'Duplicate Content'
        OTHER = 'other', 'Other'

    class FlagStatus(models.TextChoices):
        OPEN = 'open', 'Open'
        REVIEWED = 'reviewed', 'Reviewed'
        DISMISSED = 'dismissed', 'Dismissed'
        ACTION_TAKEN = 'action_taken', 'Action Taken'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='flags')
    flagged_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='raised_flags'
    )
    reason = models.CharField(max_length=30, choices=FlagReason.choices)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=FlagStatus.choices, default=FlagStatus.OPEN)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='reviewed_flags'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'document_flags'

    def __str__(self):
        return f"Flag on '{self.document.title}' — {self.reason}"
