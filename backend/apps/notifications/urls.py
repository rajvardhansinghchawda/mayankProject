"""
SARAS — Notifications URLs

GET    /api/notifications/                — list personal + broadcast
POST   /api/notifications/               — admin: create announcement
GET    /api/notifications/unread-count/  — badge count
POST   /api/notifications/read-all/      — mark all as read
PATCH  /api/notifications/:id/read/      — mark single as read
DELETE /api/notifications/:id/           — delete
"""
from django.urls import path
from . import views

app_name = 'notifications'

urlpatterns = [
    path('', views.NotificationListView.as_view(), name='list'),
    path('unread-count/', views.unread_count, name='unread-count'),
    path('read-all/', views.NotificationMarkAllReadView.as_view(), name='read-all'),
    path('<uuid:notification_id>/read/', views.NotificationMarkReadView.as_view(), name='mark-read'),
    path('<uuid:notification_id>/', views.NotificationDeleteView.as_view(), name='delete'),
]
