from django.shortcuts import render
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import generics
from rest_framework.parsers import FormParser
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from server.documents.admin import WorkflowDocumentAIDraftResponse
from server.documents.models import WorkflowDocument
from server.documents.models import WorkflowDocumentAttachment
from server.documents.serializers import WorkflowDocumentAIDraftResponseSerializer
from server.documents.serializers import WorkflowDocumentSerializer
from server.documents.serializers import WorkflowDocumentUploadInputSerializer
from server.documents.services import generate_workflow_document_ai_analysis
from server.documents.services import generate_workflow_response_from_workflow_document
from server.documents.services import upload_workflow_document_attachment_to_openai
from server.workflows.models import WorkflowStage
from server.workflows.models import WorkflowStep

# Create your views here.


class WorkflowDocumentUploadView(generics.GenericAPIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=WorkflowDocumentUploadInputSerializer,
        responses={
            201: {
                "message": "Document uploaded successfully",
            },
        },
    )
    def post(self, request, *args, **kwargs):
        serializer = WorkflowDocumentUploadInputSerializer(data=request.data)
        if serializer.is_valid():
            file = serializer.validated_data["file"]
            new_workflow_document = WorkflowDocument.objects.create(
                title=file.name,
                sender="Unknown",
                received_date=timezone.now().date(),
                user=request.user,
            )

            workflow_document_attachment = WorkflowDocumentAttachment.objects.create(
                document=new_workflow_document,
                file=file,
                file_name=file.name,
            )
            uploaded_attachment = upload_workflow_document_attachment_to_openai(
                workflow_document_attachment,
            )
            workflow_document_attachment.upload_file_id = uploaded_attachment.file_id
            workflow_document_attachment.save()
            document_ai_analysis = generate_workflow_document_ai_analysis(
                uploaded_attachment
            )
            print("AI Analysis Result:", document_ai_analysis)
            # Handle file upload and document creation logic here
            new_workflow_document.title = document_ai_analysis.title
            new_workflow_document.code = document_ai_analysis.code
            new_workflow_document.sender = document_ai_analysis.sender
            new_workflow_document.received_date = document_ai_analysis.received_date
            new_workflow_document.summary = document_ai_analysis.summary
            new_workflow_document.confidentiality = document_ai_analysis.confidentiality
            new_workflow_document.department = document_ai_analysis.department
            new_workflow_document.document_type = document_ai_analysis.document_type
            new_workflow_document.status = document_ai_analysis.status
            new_workflow_document.ai_confidence = document_ai_analysis.ai_confidence
            new_workflow_document.subject = document_ai_analysis.subject
            new_workflow_document.deadline = document_ai_analysis.deadline
            new_workflow_document.suggested_reviewer = (
                document_ai_analysis.suggested_reviewer
            )
            new_workflow_document.suggested_dept = document_ai_analysis.suggested_dept
            new_workflow_document.entities = document_ai_analysis.entities
            new_workflow_document.risk_flags = document_ai_analysis.risk_flags
            new_workflow_document.related_docs = document_ai_analysis.related_docs
            new_workflow_document.save()
            new_intake_workflow_step = WorkflowStep.objects.create(
                document=new_workflow_document,
                stage=WorkflowStage.INTAKE,
                department=new_workflow_document.department,
                assignee=request.user.username,
                status="current",
                date=timezone.now(),
            )
            new_classification_workflow_step = WorkflowStep.objects.create(
                document=new_workflow_document,
                stage=WorkflowStage.CLASSIFICATION_AND_REGISTRATION,
                department=new_workflow_document.department,
                assignee=request.user.username,
                status="pending",
                date=timezone.now(),
            )
            new_distribution_workflow_step = WorkflowStep.objects.create(
                document=new_workflow_document,
                stage=WorkflowStage.DISTRIBUTION,
                department=new_workflow_document.department,
                assignee=request.user.username,
                status="pending",
                date=timezone.now(),
            )
            new_specialized_processing_workflow_step = WorkflowStep.objects.create(
                document=new_workflow_document,
                stage=WorkflowStage.SPECIALIZED_PROCESSING,
                department=new_workflow_document.department,
                assignee=request.user.username,
                status="pending",
                date=timezone.now(),
            )
            new_approval_workflow_step = WorkflowStep.objects.create(
                document=new_workflow_document,
                stage=WorkflowStage.APPROVAL,
                department=new_workflow_document.department,
                assignee=request.user.username,
                status="pending",
                date=timezone.now(),
            )
            new_feedback_distribution_workflow_step = WorkflowStep.objects.create(
                document=new_workflow_document,
                stage=WorkflowStage.FEEDBACK_DISTRIBUTION,
                department=new_workflow_document.department,
                assignee=request.user.username,
                status="pending",
                date=timezone.now(),
            )

            return Response(
                {
                    "message": "Document uploaded successfully",
                    "document_id": str(new_workflow_document.id),
                    "ai_analysis": document_ai_analysis,
                },
                status=201,
            )
        return Response(serializer.errors, status=400)


class WorkflowDocumentListView(generics.ListAPIView):
    queryset = WorkflowDocument.objects.all().order_by("-created")
    serializer_class = WorkflowDocumentSerializer
    permission_classes = [IsAuthenticated]


class WorkflowDocumentDetailView(generics.RetrieveAPIView):
    queryset = WorkflowDocument.objects.all()
    serializer_class = WorkflowDocumentSerializer
    permission_classes = [IsAuthenticated]


class WorkflowDocumentUpdateView(generics.UpdateAPIView):
    queryset = WorkflowDocument.objects.all()
    serializer_class = WorkflowDocumentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"


class WorkflowDocumentResponseGenerationView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        id = self.kwargs.get("pk")
        document = WorkflowDocument.objects.get(id=id)
        ai_draft_response = generate_workflow_response_from_workflow_document(document)
        new_ai_draft_response = WorkflowDocumentAIDraftResponse.objects.create(
            document=document,
            content=ai_draft_response,
        )
        serializer = WorkflowDocumentAIDraftResponseSerializer(new_ai_draft_response)
        return Response(serializer.data)
