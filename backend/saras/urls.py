"""
SARAS — Root URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def health_check(request):
    return JsonResponse({'status': 'ok', 'service': 'SARAS Django API', 'version': '1.0.0'})


urlpatterns = [
    # Health check
    path('health/', health_check),

    # Django admin (restrict in production)
    path('django-admin/', admin.site.urls),

    # API v1
    path('api/auth/', include('apps.authentication.urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/documents/', include('apps.documents.urls')),
    path('api/assessments/', include('apps.assessments.urls')),
    path('api/admin/', include('apps.administration.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
]

# Admin site customization
admin.site.site_header = 'SARAS Administration'
admin.site.site_title = 'SARAS Admin'
admin.site.index_title = 'Smart Academic Resource and Secure Assessment System'
