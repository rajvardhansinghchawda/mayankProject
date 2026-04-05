"""
SARAS — Notifications Admin
"""
from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'notification_type', 'recipient_display',
        'institution', 'is_read', 'sender', 'created_at'
    ]
    list_filter = ['notification_type', 'is_read', 'created_at', 'institution']
    search_fields = ['title', 'body', 'recipient__full_name', 'recipient__email']
    readonly_fields = ['id', 'created_at', 'read_at']
    ordering = ['-created_at']

    fieldsets = (
        ('Content', {'fields': ('title', 'body', 'notification_type', 'action_url')}),
        ('Targeting', {'fields': ('recipient', 'institution', 'sender')}),
        ('Status', {'fields': ('is_read', 'read_at')}),
        ('Metadata', {'fields': ('metadata', 'id', 'created_at')}),
    )

    def recipient_display(self, obj):
        if obj.recipient:
            return obj.recipient.full_name
        return '📢 ALL USERS (Broadcast)'
    recipient_display.short_description = 'Recipient'

    actions = ['mark_as_read', 'mark_as_unread']

    def mark_as_read(self, request, queryset):
        from django.utils import timezone
        queryset.update(is_read=True, read_at=timezone.now())
        self.message_user(request, f"{queryset.count()} notification(s) marked as read.")
    mark_as_read.short_description = "Mark as Read"

    def mark_as_unread(self, request, queryset):
        queryset.update(is_read=False, read_at=None)
        self.message_user(request, f"{queryset.count()} notification(s) marked as unread.")
    mark_as_unread.short_description = "Mark as Unread"
