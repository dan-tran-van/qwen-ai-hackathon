from rest_framework import generics, viewsets

from server.documents.views import IsAuthenticated
from server.workflows.models import WorkflowStep
from server.workflows.serializers import WorkflowStepSerializer

# Create your views here.


class WorkflowStepViewSet(viewsets.ModelViewSet):
    queryset = WorkflowStep.objects.all()
    serializer_class = WorkflowStepSerializer
    permission_classes = [IsAuthenticated]


class WorkflowStepListByDocumentIdView(generics.ListAPIView):
    serializer_class = WorkflowStepSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        document_id = self.kwargs["document_id"]
        return WorkflowStep.objects.filter(document_id=document_id).order_by("date")
