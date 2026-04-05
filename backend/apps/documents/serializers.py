"""SARAS — Document Serializers"""
import logging
from django.conf import settings
from rest_framework import serializers
from .models import Document, DocumentFlag
from .watermark import DocumentWatermarkService

logger = logging.getLogger('saras')


class DocumentListSerializer(serializers.ModelSerializer):
    uploader_name = serializers.SerializerMethodField()
    section_display = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            'id', 'title', 'description', 'document_type', 'subject',
            'tags', 'file_size_bytes', 'page_count', 'view_count',
            'status', 'uploader_name', 'section_display', 'created_at',
        ]
        # CRITICAL: pdf_data is NEVER in any list/detail serializer
        # It only leaves the server through the /serve/ endpoint, watermarked

    def get_uploader_name(self, obj):
        return obj.uploader.full_name if obj.uploader else 'Unknown'

    def get_section_display(self, obj):
        if obj.section:
            return str(obj.section)
        return ''


class DocumentDetailSerializer(DocumentListSerializer):
    """Extended detail with more metadata. Still NO pdf_data."""
    original_filename = serializers.CharField()

    class Meta(DocumentListSerializer.Meta):
        fields = DocumentListSerializer.Meta.fields + ['original_filename', 'updated_at']


class DocumentUploadSerializer(serializers.Serializer):
    """
    Handles PDF upload with full validation:
    - MIME type check
    - Magic bytes check (%PDF-)
    - Size limit (2MB)
    - PyMuPDF validity check
    """
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True, default='')
    document_type = serializers.ChoiceField(choices=Document.DocumentType.choices)
    subject = serializers.CharField(max_length=255, allow_blank=True, default='')
    tags = serializers.ListField(child=serializers.CharField(max_length=50), default=list, max_length=10)
    pdf_file = serializers.FileField()
    section_id = serializers.UUIDField()

    def validate_pdf_file(self, file):
        # Size check
        if file.size > settings.MAX_UPLOAD_SIZE_BYTES:
            raise serializers.ValidationError(
                f"File too large. Maximum size is {settings.MAX_UPLOAD_SIZE_BYTES // 1048576} MB."
            )

        # MIME type check
        if hasattr(file, 'content_type') and file.content_type not in settings.ALLOWED_MIME_TYPES:
            raise serializers.ValidationError("Only PDF files are accepted.")

        # Read file for magic bytes + validity check
        pdf_bytes = file.read()
        file.seek(0)

        # Magic bytes check
        if not pdf_bytes[:5] == b'%PDF-':
            raise serializers.ValidationError("File is not a valid PDF.")

        # Full PDF validity check using PyMuPDF
        try:
            watermark_service = DocumentWatermarkService()
            metadata = watermark_service.validate_pdf(pdf_bytes)
        except ValueError as e:
            raise serializers.ValidationError(str(e))

        # Store validated bytes on the serializer for use in save()
        self._pdf_bytes = pdf_bytes
        self._pdf_metadata = metadata
        self._original_filename = file.name

        return file

    def validate_section_id(self, section_id):
        from apps.users.models import Section
        try:
            return Section.objects.get(id=section_id)
        except Section.DoesNotExist:
            raise serializers.ValidationError("Section not found.")

    def save(self, **kwargs):
        request = self.context['request']
        user = request.user

        doc = Document.objects.create(
            uploader=user,
            section=self.validated_data['section_id'],
            title=self.validated_data['title'],
            description=self.validated_data['description'],
            document_type=self.validated_data['document_type'],
            subject=self.validated_data['subject'],
            tags=self.validated_data['tags'],
            pdf_data=self._pdf_bytes,
            file_size_bytes=self._pdf_metadata['size_bytes'],
            page_count=self._pdf_metadata['page_count'],
            original_filename=self._original_filename,
            status=Document.Status.PUBLISHED,
        )

        logger.info(
            f"Document uploaded: id={doc.id}, title={doc.title}, "
            f"uploader={user.id}, size={doc.file_size_bytes}B"
        )
        return doc


class DocumentFlagSerializer(serializers.Serializer):
    reason = serializers.ChoiceField(choices=DocumentFlag.FlagReason.choices)
    description = serializers.CharField(allow_blank=True, default='')

    def save(self, document, flagged_by):
        return DocumentFlag.objects.create(
            document=document,
            flagged_by=flagged_by,
            reason=self.validated_data['reason'],
            description=self.validated_data['description'],
        )


class DocumentServeMetaSerializer(serializers.Serializer):
    """Used for serve URL response."""
    serve_url = serializers.CharField()
    expires_in_seconds = serializers.IntegerField()
