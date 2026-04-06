"""SARAS — Document URL Configuration"""
from django.urls import path
from . import views

app_name = 'documents'

urlpatterns = [
    path('', views.DocumentListView.as_view(), name='list'),
    path('upload/', views.DocumentUploadView.as_view(), name='upload'),
    path('my-uploads/', views.MyUploadsView.as_view(), name='my-uploads'),
    path('pending/', views.AdminPendingListView.as_view(), name='admin-pending'),
    path('<uuid:document_id>/', views.DocumentDetailView.as_view(), name='detail'),
    path('<uuid:document_id>/serve/', views.DocumentServeView.as_view(), name='serve'),
    path('<uuid:document_id>/manage/', views.DocumentManageView.as_view(), name='manage'),
    path('<uuid:document_id>/action/<str:action>/', views.DocumentActionView.as_view(), name='action'),
    path('<uuid:document_id>/admin-action/<str:action>/', views.AdminDocumentActionView.as_view(), name='admin-action'),
    path('<uuid:document_id>/flag/', views.FlagDocumentView.as_view(), name='flag'),
    path('<uuid:document_id>/view-log/', views.DocumentViewLogView.as_view(), name='view-log'),
]
