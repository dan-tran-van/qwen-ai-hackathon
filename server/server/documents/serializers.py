from rest_framework import serializers

from server.documents.models import WorkflowDocument


class WorkflowDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowDocument
        fields = "__all__"


class WorkflowDocumentUploadInputSerializer(serializers.Serializer):
    file = serializers.FileField()
