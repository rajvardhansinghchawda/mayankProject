from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'departments', views.DepartmentAdminViewSet, basename='admin-department')
router.register(r'sections', views.SectionAdminViewSet, basename='admin-section')
router.register(r'documents', views.DocumentAdminViewSet, basename='admin-document')

urlpatterns = [
    path('stats/', views.AdminStatsView.as_view(), name='admin-stats'),
    path('audit-log/', views.AdminAuditLogView.as_view(), name='admin-audit-log'),
    path('settings/', views.AdminSettingsView.as_view(), name='admin-settings'),
    
    path('users/bulk-upload/', views.BulkUploadView.as_view(), name='bulk-upload'),
    path('users/bulk-upload/<uuid:job_id>/status/', views.BulkUploadStatusView.as_view(), name='bulk-upload-status'),
    path('users/bulk-upload/<uuid:job_id>/errors/', views.BulkUploadErrorsView.as_view(), name='bulk-upload-errors'),
    
    path('users/<uuid:user_id>/reset-password/', views.UserAdminActionView.as_view(action_type='reset_password'), name='user-reset-password'),
    path('users/<uuid:user_id>/toggle-active/', views.UserAdminActionView.as_view(action_type='toggle_active'), name='user-toggle-active'),
    
    path('', include(router.urls)),
]
