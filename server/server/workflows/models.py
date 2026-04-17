from django.db import models
from model_utils.models import TimeStampedModel

from server.documents.models import Department
from server.documents.models import WorkflowDocument


class WorkflowStage(models.TextChoices):
    INTAKE = "Tiếp nhận"
    CLASSIFICATION_AND_REGISTRATION = "Phân loại & Đăng ký"
    DISTRIBUTION = "Phân phối"
    SPECIALIZED_PROCESSING = "Xử lý chuyên môn"
    APPROVAL = "Phê duyệt"
    FEEDBACK_DISTRIBUTION = "Phát hành phản hồi"


class WorkflowStep(TimeStampedModel):
    document = models.ForeignKey(
        WorkflowDocument,
        related_name="workflow_steps",
        on_delete=models.CASCADE,
        null=True,
    )
    stage = models.CharField(
        max_length=255, choices=WorkflowStage.choices, default=WorkflowStage.INTAKE
    )
    department = models.CharField(choices=Department.choices, max_length=50)
    assignee = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=[
            ("completed", "Completed"),
            ("current", "Current"),
            ("pending", "Pending"),
        ],
    )
    date = models.DateTimeField(null=True, blank=True)
    note = models.TextField(blank=True)

    def __str__(self):
        return f"{self.stage} - {self.department} - {self.assignee} - {self.status}"
