import uuid

from django.conf import settings
from django.db import models
from model_utils.models import TimeStampedModel


class ConfidentialityLevel(models.TextChoices):
    UNCLASSIFIED = "UNCLASSIFIED", "Không phân loại"
    CONFIDENTIAL = "CONFIDENTIAL", "Mật"
    SECRET = "SECRET", "Tuyệt mật"
    TOP_SECRET = "TOP_SECRET", "Tối mật"


class DocumentType(models.TextChoices):
    OFFICIAL_LETTER = "OFFICIAL_LETTER", "Công văn"
    REPORT = "REPORT", "Báo cáo"
    DECISION = "DECISION", "Quyết định"
    OTHER = "OTHER", "Khác"


class Department(models.TextChoices):
    ADMIN = "ADMIN", "Phòng Quản lý Hành chính"
    PLANNING = "PLANNING", "Phòng Kế hoạch Tài chính"
    ENVIRONMENT = "ENVIRONMENT", "Phòng Tài nguyên Môi trường"
    GENERAL = "GENERAL", "Phòng Tổng hợp"
    HUMAN_RESOURCES = "HUMAN_RESOURCES", "Phòng Tổ chức Cán bộ"
    MANAGEMENT = "MANAGEMENT", "Ban Giám đốc"
    CLERK = "CLERK", "Văn thư"


class DocumentStatus(models.TextChoices):
    NEW = "NEW", "Mới"
    IN_PROGRESS = "IN_PROGRESS", "Đang xử lý"
    PENDING_COORDINATION = "PENDING_COORDINATION", "Chờ phối hợp"
    PENDING_APPROVAL = "PENDING_APPROVAL", "Chờ phê duyệt"
    OVERDUE = "OVERDUE", "Quá hạn"
    COMPLETED = "COMPLETED", "Hoàn tất"


class WorkflowDocument(TimeStampedModel):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="workflow_documents",
    )
    title = models.CharField(max_length=255, blank=True)
    code = models.CharField(max_length=100, unique=True, blank=True)
    sender = models.CharField(max_length=255, blank=True)
    received_date = models.DateField(blank=True, null=True)
    summary = models.TextField(blank=True)
    confidentiality = models.CharField(
        max_length=20,
        choices=ConfidentialityLevel.choices,
        default=ConfidentialityLevel.UNCLASSIFIED,
    )
    department = models.CharField(
        max_length=50,
        choices=Department.choices,
        default=Department.GENERAL,
    )
    document_type = models.CharField(
        max_length=20,
        choices=DocumentType.choices,
        default=DocumentType.OTHER,
    )
    status = models.CharField(
        max_length=20,
        choices=DocumentStatus.choices,
        default=DocumentStatus.NEW,
    )
    ai_confidence = models.FloatField(null=True, blank=True)
    subject = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"WorkflowDocument {self.id}"


class WorkflowDocumentAttachment(TimeStampedModel):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    document = models.ForeignKey(
        WorkflowDocument,
        on_delete=models.CASCADE,
        related_name="attachments",
    )
    file = models.FileField(upload_to="workflow_documents/")

    def __str__(self):
        return f"Attachment {self.id} for Document {self.document.id}"
