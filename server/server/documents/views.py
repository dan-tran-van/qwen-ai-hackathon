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
                code=file.name,
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
            document_ai_analysis = generate_workflow_document_ai_analysis(file_id)

            # Handle file upload and document creation logic here
            return Response(
                {
                    "message": "Document uploaded successfully",
                    "document_id": str(new_workflow_document.id),
                    "ai_analysis": document_ai_analysis,
                },
                status=201,
            )
        return Response(serializer.errors, status=400)
