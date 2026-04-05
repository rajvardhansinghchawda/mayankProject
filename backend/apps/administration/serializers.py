from rest_framework import serializers
from .models import BulkImportJob

class CSVUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    import_type = serializers.ChoiceField(choices=BulkImportJob.ImportType.choices)

    def validate_file(self, value):
        if not value.name.endswith('.csv'):
            raise serializers.ValidationError("Only CSV files are allowed.")
        return value

class BulkImportJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = BulkImportJob
        fields = ['id', 'import_type', 'status', 'total_rows', 'success_rows', 'error_rows', 'created_at', 'completed_at']
