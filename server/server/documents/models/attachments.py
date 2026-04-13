# documents/models/attachments.py
from __future__ import annotations

from django.db import models

from .base import TimeStampedModel


class BaseAttachment(TimeStampedModel):
    file = models.FileField(upload_to="attachments/%Y/%m/")
    file_name = models.CharField(max_length=255)
    mime_type = models.CharField(max_length=100, blank=True)
    file_size = models.BigIntegerField(null=True, blank=True)
    is_primary = models.BooleanField(default=False)

    class Meta:
        abstract = True


class WorkflowDocumentAttachment(BaseAttachment):
    document = models.ForeignKey(
        "documents.WorkflowDocument",
        on_delete=models.CASCADE,
        related_name="attachments",
    )


class LibraryDocumentAttachment(BaseAttachment):
    document = models.ForeignKey(
        "documents.LibraryDocument",
        on_delete=models.CASCADE,
        related_name="attachments",
    )
