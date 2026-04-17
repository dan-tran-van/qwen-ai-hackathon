from rest_framework import serializers

from server.documents.models import WorkflowDocument
from server.documents.models import WorkflowDocumentAIDraftResponse
from server.documents.models import WorkflowDocumentAttachment


class WorkflowDocumentAttachmentSerializer(serializers.ModelSerializer):
    file_size_mb = serializers.SerializerMethodField()
    file_name_alt = serializers.SerializerMethodField()

    class Meta:
        model = WorkflowDocumentAttachment
        fields = "__all__"

    def get_file_size_mb(self, obj):
        if obj.file:
            # Round to 2 decimal places
            return round(obj.file.size / (1024 * 1024), 2)
        return 0

    def get_file_name_alt(self, obj):
        if obj.file:
            return obj.file.name.split("/")[-1]  # Get the file name without the path
        return ""


class WorkflowDocumentSerializer(serializers.ModelSerializer):
    # 👇 thêm mấy field AI
    suggested_reviewer = serializers.CharField(allow_null=True, required=False)
    suggested_dept = serializers.CharField(allow_null=True, required=False)

    entities = serializers.ListField(
        child=serializers.CharField(), default=list, required=False
    )
    risk_flags = serializers.ListField(
        child=serializers.CharField(), default=list, required=False
    )
    related_docs = serializers.ListField(
        child=serializers.CharField(), default=list, required=False
    )
    attachments = WorkflowDocumentAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = WorkflowDocument
        exclude = ("user",)  # Exclude the user field from the serializer

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # 👉 tạm mock hoặc sau này replace AI
        data["suggested_reviewer"] = None
        data["suggested_dept"] = None
        data["entities"] = []
        data["risk_flags"] = []
        data["related_docs"] = []

        return data


class WorkflowDocumentUploadInputSerializer(serializers.Serializer):
    file = serializers.FileField()


class WorkflowDocumentAIDraftResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowDocumentAIDraftResponse
        fields = "__all__"
