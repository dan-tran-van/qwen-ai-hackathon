from django.urls import path
from rest_framework import routers

from server.workflows.views import WorkflowStepListByDocumentIdView
from server.workflows.views import WorkflowStepViewSet

router = routers.DefaultRouter()
router.register(r"workflow-steps", WorkflowStepViewSet, basename="workflow-step")

urlpatterns = router.urls

urlpatterns += [
    path(
        "document/<str:document_id>/workflow-steps/",
        WorkflowStepListByDocumentIdView.as_view(),
        name="workflow-steps-by-document",
    ),
]
