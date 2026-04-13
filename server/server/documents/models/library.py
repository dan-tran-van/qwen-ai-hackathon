from __future__ import annotations

from django.db import models

from .base import BaseDocument
from .base import TimeStampedModel
from .enums import LibraryCategory
from .enums import LibraryDocumentStatus
from .enums import LibraryDocumentType
from .enums import LibraryRelationType


class LibraryDocument(BaseDocument):
    document_type = models.CharField(
        max_length=40,
        choices=LibraryDocumentType.choices,
        default=LibraryDocumentType.LEGAL_DOCUMENT,
        db_index=True,
    )
    status = models.CharField(
        max_length=32,
        choices=LibraryDocumentStatus.choices,
        default=LibraryDocumentStatus.EFFECTIVE,
        db_index=True,
    )
    category = models.CharField(
        max_length=40,
        choices=LibraryCategory.choices,
        default=LibraryCategory.LEGAL,
        db_index=True,
    )

    issuing_agency = models.CharField(max_length=255, db_index=True)
    issuing_department = models.CharField(max_length=255, blank=True)

    issued_at = models.DateField(null=True, blank=True, db_index=True)
    effective_at = models.DateField(null=True, blank=True, db_index=True)
    expires_at = models.DateField(null=True, blank=True, db_index=True)

    version_label = models.CharField(max_length=50, blank=True)
    reference_number = models.CharField(max_length=120, blank=True, db_index=True)

    class Meta:
        ordering = ["-issued_at", "-created_at"]


class LibraryDocumentRelation(TimeStampedModel):
    source = models.ForeignKey(
        "documents.LibraryDocument",
        on_delete=models.CASCADE,
        related_name="outgoing_relations",
    )
    target = models.ForeignKey(
        "documents.LibraryDocument",
        on_delete=models.CASCADE,
        related_name="incoming_relations",
    )
    relation_type = models.CharField(
        max_length=32,
        choices=LibraryRelationType.choices,
        default=LibraryRelationType.RELATED,
    )
