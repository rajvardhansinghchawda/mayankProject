"""
SARAS — Documents Admin
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Document, DocumentViewLog, DocumentFlag


class DocumentViewLogInline(admin.TabularInline):
    model = DocumentViewLog
    extra = 0
    readonly_fields = ['viewer', 'ip_address', 'watermark_text', 'viewed_at']
    can_delete = False
    max_num = 20

    def has_add_permission(self, request, obj=None):
        return False


class DocumentFlagInline(admin.TabularInline):
    model = DocumentFlag
    extra = 0
    readonly_fields = ['flagged_by', 'reason', 'description', 'status', 'created_at']
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'section', 'uploader', 'document_type', 'status',
        'file_size_kb', 'page_count', 'view_count', 'flag_count_display', 'created_at'
    ]
    list_filter = ['status', 'document_type', 'section__department', 'created_at']
    search_fields = ['title', 'description', 'subject', 'uploader__full_name']
    readonly_fields = [
        'id', 'file_size_bytes', 'page_count', 'view_count',
        'created_at', 'updated_at', 'pdf_data_size'
    ]
    ordering = ['-created_at']
    inlines = [DocumentFlagInline, DocumentViewLogInline]

    fieldsets = (
        ('Document Info', {
            'fields': ('id', 'title', 'description', 'document_type', 'subject', 'tags')
        }),
        ('Ownership', {
            'fields': ('uploader', 'section')
        }),
        ('Status & Moderation', {
            'fields': ('status', 'rejection_reason')
        }),
        ('File Metadata', {
            'fields': ('file_size_bytes', 'page_count', 'original_filename', 'pdf_data_size')
        }),
        ('Statistics', {
            'fields': ('view_count', 'created_at', 'updated_at')
        }),
    )

    actions = ['approve_documents', 'reject_documents', 'flag_documents']

    def file_size_kb(self, obj):
        return f"{obj.file_size_bytes / 1024:.1f} KB"
    file_size_kb.short_description = 'Size'

    def flag_count_display(self, obj):
        count = obj.flags.filter(status='open').count()
        if count > 0:
            return format_html('<span style="color:red;font-weight:bold">{}</span>', count)
        return count
    flag_count_display.short_description = 'Open Flags'

    def pdf_data_size(self, obj):
        """Shows stored BYTEA size without exposing raw bytes."""
        return f"{len(bytes(obj.pdf_data)) / 1024:.1f} KB (stored in PostgreSQL)" if obj.pdf_data else "No data"
    pdf_data_size.short_description = 'PDF Storage'

    def approve_documents(self, request, queryset):
        updated = queryset.filter(status=Document.Status.PENDING_REVIEW).update(
            status=Document.Status.PUBLISHED
        )
        self.message_user(request, f"{updated} document(s) approved and published.")
    approve_documents.short_description = "✅ Approve selected documents"

    def reject_documents(self, request, queryset):
        updated = queryset.update(status=Document.Status.REJECTED)
        self.message_user(request, f"{updated} document(s) rejected.")
    reject_documents.short_description = "❌ Reject selected documents"

    def flag_documents(self, request, queryset):
        updated = queryset.update(status=Document.Status.FLAGGED)
        self.message_user(request, f"{updated} document(s) flagged for review.")
    flag_documents.short_description = "🚩 Flag selected documents"

    def has_add_permission(self, request):
        # Documents are added via API, not admin panel
        return False


@admin.register(DocumentViewLog)
class DocumentViewLogAdmin(admin.ModelAdmin):
    list_display = ['document', 'viewer', 'ip_address', 'watermark_text', 'viewed_at']
    list_filter = ['viewed_at']
    search_fields = ['document__title', 'viewer__full_name', 'watermark_text', 'ip_address']
    readonly_fields = ['document', 'viewer', 'ip_address', 'user_agent', 'watermark_text', 'viewed_at']
    ordering = ['-viewed_at']

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        # Audit logs must not be deletable from admin
        return False


@admin.register(DocumentFlag)
class DocumentFlagAdmin(admin.ModelAdmin):
    list_display = ['document', 'flagged_by', 'reason', 'status', 'created_at']
    list_filter = ['status', 'reason', 'created_at']
    search_fields = ['document__title', 'flagged_by__full_name', 'description']
    readonly_fields = ['document', 'flagged_by', 'reason', 'description', 'created_at']
    ordering = ['-created_at']

    actions = ['mark_reviewed', 'dismiss_flags']

    def mark_reviewed(self, request, queryset):
        queryset.update(status=DocumentFlag.FlagStatus.REVIEWED, reviewed_by=request.user)
        self.message_user(request, f"{queryset.count()} flag(s) marked as reviewed.")
    mark_reviewed.short_description = "Mark as Reviewed"

    def dismiss_flags(self, request, queryset):
        queryset.update(status=DocumentFlag.FlagStatus.DISMISSED, reviewed_by=request.user)
        self.message_user(request, f"{queryset.count()} flag(s) dismissed.")
    dismiss_flags.short_description = "Dismiss Flags"
