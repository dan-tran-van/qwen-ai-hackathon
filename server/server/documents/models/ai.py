from __future__ import annotations

from django.conf import settings
from django.db import models

from .base import TimeStampedModel
from .enums import AIProcessingStatus
from .enums import AIReviewStatus


class BaseAIAnalysis(TimeStampedModel):
    model_name = models.CharField(max_length=100)
    summary = models.TextField(blank=True)
    extracted_entities = models.JSONField(default=list, blank=True)
    confidence_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
    )

    processing_status = models.CharField(
        max_length=20,
        choices=AIProcessingStatus.choices,
        default=AIProcessingStatus.PENDING,
        db_index=True,
    )
    review_status = models.CharField(
        max_length=20,
        choices=AIReviewStatus.choices,
        default=AIReviewStatus.PENDING,
        db_index=True,
    )

    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True


class WorkflowDocumentAIAnalysis(BaseAIAnalysis):
    document = models.OneToOneField(
        "documents.WorkflowDocument",
        on_delete=models.CASCADE,
        related_name="ai_analysis",
    )
    suggested_department = models.CharField(max_length=255, blank=True)
    suggested_reviewer = models.CharField(max_length=255, blank=True)
    detected_deadline = models.DateTimeField(null=True, blank=True)
    risk_flags = models.JSONField(default=list, blank=True)


class LibraryDocumentAIAnalysis(BaseAIAnalysis):
    document = models.OneToOneField(
        "documents.LibraryDocument",
        on_delete=models.CASCADE,
        related_name="ai_analysis",
    )
    related_keywords = models.JSONField(default=list, blank=True)
    legal_topics = models.JSONField(default=list, blank=True)
