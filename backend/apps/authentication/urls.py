"""
SARAS — Authentication URLs
"""
from django.urls import path
from . import views

app_name = 'authentication'

urlpatterns = [
    path('login/', views.SARASLoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('token/refresh/', views.TokenRefreshView.as_view(), name='token_refresh'),
    path('password/change/', views.PasswordChangeView.as_view(), name='password_change'),
    path('me/', views.me, name='me'),
    path('users/bulk-upload/', views.BulkUploadView.as_view(), name='bulk_upload'),
]
