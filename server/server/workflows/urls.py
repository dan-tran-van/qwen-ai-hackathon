from rest_framework import routers
from rest_framework import urlpatterns

from server.workflows.views import WorkflowStepViewSet

router = routers.DefaultRouter()
router.register(r"workflow-steps", WorkflowStepViewSet, basename="workflow-step")

urlpatterns = router.urls
