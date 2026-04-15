from django.urls import path

from server.documents.views import WorkflowDocumentUploadView

urlpatterns = [
    path(
        "upload/",
        WorkflowDocumentUploadView.as_view(),
        name="upload_workflow_document_attachment",
    ),
]
