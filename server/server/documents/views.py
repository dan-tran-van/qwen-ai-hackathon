from django.shortcuts import render
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import generics
from rest_framework.parsers import FormParser
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from server.documents.models import WorkflowDocument
from server.documents.models import WorkflowDocumentAttachment
from server.documents.serializers import WorkflowDocumentSerializer
from server.documents.serializers import WorkflowDocumentUploadInputSerializer
from server.documents.services import generate_workflow_document_ai_analysis
from server.documents.services import upload_workflow_document_attachment_to_openai

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
            )
            file_id = upload_workflow_document_attachment_to_openai(
                workflow_document_attachment,
            )
            workflow_document_attachment.upload_file_id = file_id
            workflow_document_attachment.save()
            document_ai_analysis = generate_workflow_document_ai_analysis(file_id)
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
            new_workflow_document.save()
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
    queryset = WorkflowDocument.objects.all()
    serializer_class = WorkflowDocumentSerializer
    permission_classes = [IsAuthenticated]


class WorkflowDocumentDetailView(generics.RetrieveAPIView):
    queryset = WorkflowDocument.objects.all()
    serializer_class = WorkflowDocumentSerializer
    permission_classes = [IsAuthenticated]
