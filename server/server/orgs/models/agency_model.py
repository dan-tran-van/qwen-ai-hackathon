from __future__ import annotations

import uuid

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _


class Agency(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    short_name = models.CharField(max_length=100, blank=True)
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="children",
    )
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("name",)
        verbose_name = _("agency")
        verbose_name_plural = _("agencies")
        indexes = [
            models.Index(fields=("is_active", "name")),
            models.Index(fields=("parent",)),
        ]

    def __str__(self) -> str:
        return self.short_name or self.name

    def clean(self) -> None:
        super().clean()

        if self.parent_id and self.parent_id == self.id:
            raise ValidationError({"parent": _("An agency cannot be its own parent.")})
