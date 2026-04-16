from rest_framework import serializers

from server.documents.models import WorkflowDocument


class WorkflowDocumentSerializer(serializers.ModelSerializer):
    # 👇 thêm mấy field AI
    suggested_reviewer = serializers.CharField(allow_null=True, required=False)
    suggested_dept = serializers.CharField(allow_null=True, required=False)

    entities = serializers.ListField(
        child=serializers.CharField(),
        default=list,
        required=False
    )
    risk_flags = serializers.ListField(
        child=serializers.CharField(),
        default=list,
        required=False
    )
    related_docs = serializers.ListField(
        child=serializers.CharField(),
        default=list,
        required=False
    )

    class Meta:
        model = WorkflowDocument
        fields = "__all__"

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
