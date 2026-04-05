from django.contrib import admin
from .models import BulkImportJob

@admin.register(BulkImportJob)
class BulkImportJobAdmin(admin.ModelAdmin):
    list_display = ('id', 'admin', 'import_type', 'status', 'created_at', 'completed_at')
    list_filter = ('import_type', 'status')
    search_fields = ('admin__email', 'admin__full_name')
