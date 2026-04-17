from rest_framework import viewsets

from server.documents.views import IsAuthenticated
from server.workflows.models import WorkflowStep
from server.workflows.serializers import WorkflowStepSerializer

# Create your views here.


class WorkflowStepViewSet(viewsets.ModelViewSet):
    queryset = WorkflowStep.objects.all()
    serializer_class = WorkflowStepSerializer
    permission_classes = [IsAuthenticated]
