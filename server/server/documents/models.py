from __future__ import annotations

import uuid
from datetime import datetime

from django.conf import settings
from django.core.validators import MaxValueValidator
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from server.orgs.models import Agency
from server.orgs.models import Department


class ConfidentialityLevel(models.TextChoices):
    NORMAL = "normal", _("Thường")
    CONFIDENTIAL = "confidential", _("Mật")
    SECRET = "secret", _("Tối mật")
    TOP_SECRET = "top_secret", _("Tuyệt mật")


def document_upload_to(instance: "StoredFile", filename: str) -> str:
    now = datetime.now()
    return f"documents/{now:%Y/%m/%d}/{uuid.uuid4()}-{filename}"


class StoredFile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.FileField(upload_to=document_upload_to)
    original_name = models.CharField(max_length=255)
    mime_type = models.CharField(max_length=255, blank=True)
    size_bytes = models.PositiveBigIntegerField(default=0)
    sha256 = models.CharField(max_length=64, db_index=True)
    page_count = models.PositiveIntegerField(null=True, blank=True)
    extracted_text = models.TextField(blank=True)

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-uploaded_at",)
        indexes = [
            models.Index(fields=("uploaded_at",)),
            models.Index(fields=("mime_type",)),
        ]

    def __str__(self) -> str:
        return self.original_name


class AbstractBaseDocument(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=500)
    summary = models.TextField(blank=True)
    confidentiality_level = models.CharField(
        max_length=32,
        choices=ConfidentialityLevel.choices,
        default=ConfidentialityLevel.NORMAL,
    )
    primary_file = models.ForeignKey(
        StoredFile,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="+",
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ("-created_at",)


class SubmittedDocumentStatus(models.TextChoices):
    NEW = "new", _("Mới")
    IN_PROGRESS = "in_progress", _("Đang xử lý")
    WAITING_COORDINATION = "waiting_coordination", _("Chờ phối hợp")
    WAITING_APPROVAL = "waiting_approval", _("Chờ phê duyệt")
    OVERDUE = "overdue", _("Quá hạn")
    COMPLETED = "completed", _("Hoàn tất")


class SubmittedDocument(AbstractBaseDocument):
    sender_name = models.CharField(max_length=255)
    sender_agency = models.ForeignKey(
        Agency,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="submitted_documents_from_agency",
    )
    received_at = models.DateTimeField()
    document_type = models.CharField(max_length=100)
    subject = models.CharField(max_length=500, blank=True)
    current_status = models.CharField(
        max_length=32,
        choices=SubmittedDocumentStatus.choices,
        default=SubmittedDocumentStatus.NEW,
    )
    deadline_at = models.DateTimeField(null=True, blank=True)
    current_department = models.ForeignKey(
        Department,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="submitted_documents",
    )
    current_assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    closed_at = models.DateTimeField(null=True, blank=True)

    class Meta(AbstractBaseDocument.Meta):
        indexes = [
            models.Index(fields=("current_status",)),
            models.Index(fields=("current_department",)),
            models.Index(fields=("deadline_at",)),
            models.Index(fields=("confidentiality_level",)),
            models.Index(fields=("received_at",)),
        ]

    def __str__(self) -> str:
        return f"{self.code} - {self.title}"


class SubmittedDocumentAttachment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(
        SubmittedDocument,
        on_delete=models.CASCADE,
        related_name="attachments",
    )
    file = models.ForeignKey(
        StoredFile,
        on_delete=models.PROTECT,
        related_name="submitted_document_attachments",
    )
    label = models.CharField(max_length=255, blank=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("created_at",)
        constraints = [
            models.UniqueConstraint(
                fields=("document", "file"),
                name="uniq_submitted_document_attachment",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.document.code} - {self.file.original_name}"


class SubmittedDocumentAIAnalysis(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(
        SubmittedDocument,
        on_delete=models.CASCADE,
        related_name="analyses",
    )
    model_name = models.CharField(max_length=100)
    analysis_version = models.PositiveIntegerField(default=1)
    extracted_title = models.CharField(max_length=500, blank=True)
    detected_type = models.CharField(max_length=100, blank=True)
    subject = models.CharField(max_length=500, blank=True)
    summary = models.TextField(blank=True)
    deadline_at = models.DateTimeField(null=True, blank=True)
    suggested_department = models.ForeignKey(
        Department,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    suggested_reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    suggested_confidentiality_level = models.CharField(
        max_length=32,
        choices=ConfidentialityLevel.choices,
        default=ConfidentialityLevel.NORMAL,
    )
    confidence_score = models.DecimalField(
        max_digits=5,
        decimal_places=4,
        validators=[MinValueValidator(0), MaxValueValidator(1)],
    )
    raw_output = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    approved_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=("document", "is_active")),
            models.Index(fields=("model_name",)),
        ]

    def __str__(self) -> str:
        return f"{self.document.code} - {self.model_name}"


class SubmittedDocumentEntity(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    analysis = models.ForeignKey(
        SubmittedDocumentAIAnalysis,
        on_delete=models.CASCADE,
        related_name="entities",
    )
    text = models.CharField(max_length=255)
    entity_type = models.CharField(max_length=100)
    start_offset = models.PositiveIntegerField(null=True, blank=True)
    end_offset = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ("entity_type", "text")
        indexes = [
            models.Index(fields=("entity_type",)),
        ]

    def __str__(self) -> str:
        return f"{self.entity_type}: {self.text}"


class LibraryDocumentStatus(models.TextChoices):
    EFFECTIVE = "effective", _("Hiệu lực")
    EXPIRED = "expired", _("Hết hiệu lực")
    DRAFT = "draft", _("Dự thảo")


class LibraryDocumentTag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)

    class Meta:
        ordering = ("name",)

    def __str__(self) -> str:
        return self.name


class LibraryDocument(AbstractBaseDocument):
    issuing_agency = models.ForeignKey(
        Agency,
        on_delete=models.PROTECT,
        related_name="library_documents",
    )
    document_type = models.CharField(max_length=100)
    issue_date = models.DateField()
    effective_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    library_status = models.CharField(
        max_length=32,
        choices=LibraryDocumentStatus.choices,
        default=LibraryDocumentStatus.EFFECTIVE,
    )
    content_text = models.TextField(blank=True)
    version_label = models.CharField(max_length=100, blank=True)
    is_current_version = models.BooleanField(default=True)
    tags = models.ManyToManyField(
        LibraryDocumentTag,
        related_name="library_documents",
        blank=True,
    )

    class Meta(AbstractBaseDocument.Meta):
        indexes = [
            models.Index(fields=("issuing_agency",)),
            models.Index(fields=("library_status",)),
            models.Index(fields=("effective_date",)),
            models.Index(fields=("confidentiality_level",)),
        ]

    def __str__(self) -> str:
        return f"{self.code} - {self.title}"
