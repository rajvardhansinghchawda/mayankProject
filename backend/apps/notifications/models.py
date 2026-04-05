"""
SARAS — Notifications Models

Two notification types:
1. SystemNotification (already in users.models) — user-specific
2. Notification (this model) — institution-scoped, supports broadcast (recipient=None)

The Notification model here follows the DB schema spec exactly.
"""
import uuid
from django.db import models
from django.conf import settings


class Notification(models.Model):
    """
    Institution-scoped notification.
    - recipient=None means broadcast to all users in the institution
    - recipient=<User> means personal notification
    """
    class NotificationType(models.TextChoices):
        # System events
        DOCUMENT_APPROVED = 'document_approved', 'Document Approved'
        DOCUMENT_REJECTED = 'document_rejected', 'Document Rejected'
        DOCUMENT_FLAGGED = 'document_flagged', 'Document Flagged'
        # Assessment events
        TEST_PUBLISHED = 'test_published', 'Test Published'
        TEST_RESULTS_RELEASED = 'test_results_released', 'Test Results Released'
        TEST_REMINDER = 'test_reminder', 'Test Reminder'
        AUTO_SUBMITTED = 'auto_submitted', 'Test Auto-Submitted'
        # Admin events
        BULK_IMPORT_COMPLETE = 'bulk_import_complete', 'Bulk Import Complete'
        BULK_IMPORT_FAILED = 'bulk_import_failed', 'Bulk Import Failed'
        # General
        ANNOUNCEMENT = 'announcement', 'Announcement'
        INFO = 'info', 'Info'
        WARNING = 'warning', 'Warning'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # NULL = broadcast to entire institution
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name='received_notifications'
    )
    institution = models.ForeignKey(
        'users.Institution',
        on_delete=models.CASCADE,
        related_name='notifications'
    )

    title = models.CharField(max_length=255)
    body = models.TextField(blank=True)
    notification_type = models.CharField(
        max_length=50,
        choices=NotificationType.choices,
        default=NotificationType.INFO
    )

    # Optional deep-link for the frontend
    action_url = models.CharField(max_length=500, blank=True)

    # Read tracking — only relevant for personal notifications
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)

    # Who sent it (admin, system, or teacher)
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='sent_notifications'
    )

    # Extra context (e.g., document_id, test_id)
    metadata = models.JSONField(default=dict)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', '-created_at']),
            models.Index(fields=['institution', '-created_at']),
        ]

    def __str__(self):
        target = self.recipient.full_name if self.recipient else "ALL USERS"
        return f"[{self.notification_type}] → {target}: {self.title}"

    @property
    def is_broadcast(self):
        return self.recipient is None
