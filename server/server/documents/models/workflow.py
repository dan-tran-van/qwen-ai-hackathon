from __future__ import annotations

from django.conf import settings
from django.db import models

from .base import BaseDocument
from .base import TimeStampedModel
from .enums import WorkflowDocumentType
from .enums import WorkflowIntakeChannel
from .enums import WorkflowStage
from .enums import WorkflowStatus
from .enums import WorkflowUrgencyLevel


class WorkflowDocument(BaseDocument):
    document_type = models.CharField(
        max_length=40,
        choices=WorkflowDocumentType.choices,
        default=WorkflowDocumentType.OFFICIAL_LETTER,
        db_index=True,
    )
    status = models.CharField(
        max_length=32,
        choices=WorkflowStatus.choices,
        default=WorkflowStatus.NEW,
        db_index=True,
    )
    current_stage = models.CharField(
        max_length=32,
        choices=WorkflowStage.choices,
        default=WorkflowStage.INTAKE,
        db_index=True,
    )
    urgency_level = models.CharField(
        max_length=32,
        choices=WorkflowUrgencyLevel.choices,
        default=WorkflowUrgencyLevel.NORMAL,
        db_index=True,
    )
    intake_channel = models.CharField(
        max_length=32,
        choices=WorkflowIntakeChannel.choices,
        default=WorkflowIntakeChannel.DIRECT_UPLOAD,
    )

    sender_name = models.CharField(max_length=255, blank=True)
    sender_agency = models.CharField(max_length=255, blank=True)
    assigned_department = models.CharField(max_length=255, blank=True)

    received_at = models.DateTimeField(null=True, blank=True, db_index=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    due_at = models.DateTimeField(null=True, blank=True, db_index=True)

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="assigned_workflow_documents",
    )

    class Meta:
        ordering = ["-received_at", "-created_at"]


class WorkflowTransition(TimeStampedModel):
    document = models.ForeignKey(
        "documents.WorkflowDocument",
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
    )
    acted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
    )
    note = models.TextField(blank=True)
