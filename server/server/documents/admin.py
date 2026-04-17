from django.contrib import admin

from server.documents.models import WorkflowDocument
from server.documents.models import WorkflowDocumentAIDraftResponse
from server.documents.models import WorkflowDocumentAttachment

# Register your models here.


class WorkflowDocumentAttachmentInline(admin.TabularInline):
    model = WorkflowDocumentAttachment
    extra = 0


@admin.register(WorkflowDocument)
class WorkflowDocumentAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "code", "sender", "received_date", "user")
    search_fields = ("title", "code", "sender")
    list_filter = ("received_date",)
    inlines = [WorkflowDocumentAttachmentInline]


@admin.register(WorkflowDocumentAttachment)
class WorkflowDocumentAttachmentAdmin(admin.ModelAdmin):
    list_display = ("id", "document", "file", "upload_file_id")
    search_fields = ("document__title", "file")
    list_filter = ("document__received_date",)


@admin.register(WorkflowDocumentAIDraftResponse)
class WorkflowDocumentAIDraftResponseAdmin(admin.ModelAdmin):
    list_display = ("id", "document", "response_text", "confidence_score")
    search_fields = ("document__title", "response_text")
    list_filter = ("created_at",)
