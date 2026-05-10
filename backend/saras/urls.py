"""
SARAS — Root URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


from django.db import connection

def health_check(request):
    """
    Enhanced health check that pings the database.
    This prevents Supabase from pausing the project due to inactivity.
    """
    db_status = "ok"
    try:
        # Perform a simple query to keep the connection alive
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
    except Exception as e:
        db_status = f"error: {str(e)}"

    return JsonResponse({
        'status': 'ok' if db_status == "ok" else "degraded",
        'database': db_status,
        'service': 'SARAS Django API',
        'version': '1.0.0'
    })


urlpatterns = [
    # Health check (Ping this URL to keep database alive)
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
