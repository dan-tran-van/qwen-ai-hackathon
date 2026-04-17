from django.urls import path

from server.documents.views import WorkflowDocumentDetailView
from server.documents.views import WorkflowDocumentListView
from server.documents.views import WorkflowDocumentResponseGenerationView
from server.documents.views import WorkflowDocumentUpdateView
from server.documents.views import WorkflowDocumentUploadView

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
    path(
        "<uuid:pk>/",
        WorkflowDocumentDetailView.as_view(),
        name="workflow_document_detail",
    ),
    path(
        "<uuid:pk>/generate_response/",
        WorkflowDocumentResponseGenerationView.as_view(),
        name="workflow_document_generate_response",
    ),
    path(
        "<uuid:pk>/update/",
        WorkflowDocumentUpdateView.as_view(),
        name="workflow_document_update",
    ),
]
