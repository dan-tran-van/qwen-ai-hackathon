from django.urls import path

from server.documents.views import WorkflowDocumentListView, WorkflowDocumentUploadView

urlpatterns = [
    path(
        "upload/",
        WorkflowDocumentUploadView.as_view(),
        name="upload_workflow_document_attachment",
    ),
    path(
        "",
        WorkflowDocumentListView.as_view(),
        name="workflow_document_list",
    ),
]
