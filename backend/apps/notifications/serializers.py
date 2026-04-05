"""
SARAS — Notifications Serializers
"""
from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    is_broadcast = serializers.BooleanField(read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'body', 'notification_type',
            'action_url', 'is_read', 'read_at', 'is_broadcast',
            'sender_name', 'metadata', 'created_at',
        ]

    def get_sender_name(self, obj):
        return obj.sender.full_name if obj.sender else 'SARAS System'


class NotificationCreateSerializer(serializers.Serializer):
    """
    Used by admins to create announcements.
    recipient_id=None means broadcast to institution.
    """
    title = serializers.CharField(max_length=255)
    body = serializers.CharField(allow_blank=True, default='')
    notification_type = serializers.ChoiceField(
        choices=Notification.NotificationType.choices,
        default=Notification.NotificationType.ANNOUNCEMENT
    )
    action_url = serializers.CharField(max_length=500, allow_blank=True, default='')
    recipient_id = serializers.UUIDField(required=False, allow_null=True, default=None)

    def save(self, sender, institution):
        from apps.users.models import User
        recipient = None
        if self.validated_data.get('recipient_id'):
            try:
                recipient = User.objects.get(id=self.validated_data['recipient_id'])
            except User.DoesNotExist:
                raise serializers.ValidationError({'recipient_id': 'User not found.'})

        return Notification.objects.create(
            title=self.validated_data['title'],
            body=self.validated_data['body'],
            notification_type=self.validated_data['notification_type'],
            action_url=self.validated_data.get('action_url', ''),
            recipient=recipient,
            institution=institution,
            sender=sender,
        )
