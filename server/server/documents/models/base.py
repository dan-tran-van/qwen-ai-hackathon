from __future__ import annotations

import uuid

from django.conf import settings
from django.db import models
from model_utils.models import TimeStampedModel

from .enums import ConfidentialityLevel


class BaseDocument(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    code = models.CharField(max_length=120, db_index=True)
    title = models.CharField(max_length=500, db_index=True)
    summary = models.TextField(blank=True)

    confidentiality_level = models.CharField(
        max_length=32,
        choices=ConfidentialityLevel.choices,
        default=ConfidentialityLevel.NORMAL,
        db_index=True,
    )

    file = models.FileField(upload_to="documents/%Y/%m/")
    file_name = models.CharField(max_length=255, blank=True)
    mime_type = models.CharField(max_length=100, blank=True)
    file_size = models.BigIntegerField(null=True, blank=True)
    extracted_text = models.TextField(blank=True)

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="%(class)s_uploaded_documents",
    )

    class Meta:
        abstract = True
