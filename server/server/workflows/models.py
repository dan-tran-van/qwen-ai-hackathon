from __future__ import annotations

import uuid

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from server.documents.models import SubmittedDocument
from server.orgs.models import Department


class WorkflowStage(models.TextChoices):
    INTAKE = "intake", _("Tiếp nhận")
    REGISTRATION = "registration", _("Phân loại & đăng ký")
    DISTRIBUTION = "distribution", _("Phân phối")
    REVIEW = "review", _("Xử lý chuyên môn")
    CONSULTATION = "consultation", _("Tham vấn")
    APPROVAL = "approval", _("Phê duyệt")
    RESPONSE = "response", _("Phát hành phản hồi")
    CLOSED = "closed", _("Đóng hồ sơ")


class WorkflowCaseStatus(models.TextChoices):
    ACTIVE = "active", _("Đang hoạt động")
    BLOCKED = "blocked", _("Đang bị chặn")
    COMPLETED = "completed", _("Hoàn tất")
    CANCELLED = "cancelled", _("Đã hủy")


class WorkflowStepStatus(models.TextChoices):
    PENDING = "pending", _("Chờ")
    CURRENT = "current", _("Hiện tại")
    COMPLETED = "completed", _("Hoàn tất")
    SKIPPED = "skipped", _("Bỏ qua")


class WorkflowConsultationStatus(models.TextChoices):
    REQUESTED = "requested", _("Đã yêu cầu")
    RESPONDED = "responded", _("Đã phản hồi")
    CANCELLED = "cancelled", _("Đã hủy")


class WorkflowTransitionAction(models.TextChoices):
    BOOTSTRAP = "bootstrap", _("Khởi tạo")
    ASSIGN = "assign", _("Phân công")
    ROUTE = "route", _("Chuyển bước")
    REQUEST_CONSULTATION = "request_consultation", _("Xin ý kiến")
    COMPLETE_CONSULTATION = "complete_consultation", _("Hoàn tất tham vấn")
    APPROVE = "approve", _("Phê duyệt")
    RETURN = "return", _("Trả lại")
    BLOCK = "block", _("Chặn")
    UNBLOCK = "unblock", _("Bỏ chặn")
    CLOSE = "close", _("Đóng hồ sơ")


class WorkflowCase(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.OneToOneField(
        SubmittedDocument,
        on_delete=models.CASCADE,
        related_name="workflow_case",
    )
    case_status = models.CharField(
        max_length=32,
        choices=WorkflowCaseStatus.choices,
        default=WorkflowCaseStatus.ACTIVE,
    )
    current_stage = models.CharField(
        max_length=32,
        choices=WorkflowStage.choices,
        default=WorkflowStage.INTAKE,
    )
    current_department = models.ForeignKey(
        Department,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="workflow_cases",
    )
    current_assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    due_at = models.DateTimeField(null=True, blank=True)
    blocked_reason = models.TextField(blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    last_transitioned_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ("-started_at",)
        indexes = [
            models.Index(fields=("case_status",)),
            models.Index(fields=("current_stage",)),
            models.Index(fields=("current_department",)),
            models.Index(fields=("due_at",)),
        ]

    def __str__(self) -> str:
        return f"{self.document.code} workflow"


class WorkflowStep(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    case = models.ForeignKey(
        WorkflowCase,
        on_delete=models.CASCADE,
        related_name="steps",
    )
    order_index = models.PositiveSmallIntegerField()
    stage = models.CharField(max_length=32, choices=WorkflowStage.choices)
    status = models.CharField(
        max_length=32,
        choices=WorkflowStepStatus.choices,
        default=WorkflowStepStatus.PENDING,
    )
    department = models.ForeignKey(
        Department,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="+",
    )
    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    entered_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    sla_due_at = models.DateTimeField(null=True, blank=True)
    note = models.TextField(blank=True)

    class Meta:
        ordering = ("order_index",)
        constraints = [
            models.UniqueConstraint(
                fields=("case", "order_index"),
                name="uniq_workflow_step_case_order",
            ),
            models.UniqueConstraint(
                fields=("case", "stage"),
                name="uniq_workflow_step_case_stage",
            ),
        ]
        indexes = [
            models.Index(fields=("case", "status")),
            models.Index(fields=("stage",)),
        ]

    def __str__(self) -> str:
        return f"{self.case.document.code} - {self.stage}"


class WorkflowConsultation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    case = models.ForeignKey(
        WorkflowCase,
        on_delete=models.CASCADE,
        related_name="consultations",
    )
    step = models.ForeignKey(
        WorkflowStep,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="consultations",
    )
    from_department = models.ForeignKey(
        Department,
        on_delete=models.PROTECT,
        related_name="workflow_consultations_sent",
    )
    to_department = models.ForeignKey(
        Department,
        on_delete=models.PROTECT,
        related_name="workflow_consultations_received",
    )
    requested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    responded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    status = models.CharField(
        max_length=32,
        choices=WorkflowConsultationStatus.choices,
        default=WorkflowConsultationStatus.REQUESTED,
    )
    request_note = models.TextField(blank=True)
    response_note = models.TextField(blank=True)
    due_at = models.DateTimeField(null=True, blank=True)
    requested_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ("-requested_at",)
        indexes = [
            models.Index(fields=("status",)),
            models.Index(fields=("to_department",)),
        ]

    def __str__(self) -> str:
        return f"{self.case.document.code} consultation"


class WorkflowTransition(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    case = models.ForeignKey(
        WorkflowCase,
        on_delete=models.CASCADE,
        related_name="transitions",
    )
    from_stage = models.CharField(
        max_length=32,
        choices=WorkflowStage.choices,
        blank=True,
    )
    to_stage = models.CharField(
        max_length=32,
        choices=WorkflowStage.choices,
        blank=True,
    )
    from_department = models.ForeignKey(
        Department,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    to_department = models.ForeignKey(
        Department,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    from_assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    to_assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    action = models.CharField(max_length=64, choices=WorkflowTransitionAction.choices)
    note = models.TextField(blank=True)
    performed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    performed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-performed_at",)
        indexes = [
            models.Index(fields=("case", "performed_at")),
            models.Index(fields=("action",)),
        ]

    def __str__(self) -> str:
        return f"{self.case.document.code} - {self.action}"
