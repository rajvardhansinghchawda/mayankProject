"""
SARAS — Notifications App Configuration
"""
from django.apps import AppConfig


class NotificationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.notifications'
    verbose_name = 'Notifications'

default_app_config = 'apps.notifications.apps.NotificationsConfig'
