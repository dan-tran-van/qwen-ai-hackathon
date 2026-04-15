from __future__ import annotations

import uuid

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _

from server.orgs.models.agency_model import Agency


class Department(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agency = models.ForeignKey(
        Agency,
        on_delete=models.PROTECT,
        related_name="departments",
    )
    code = models.CharField(max_length=50)
    name = models.CharField(max_length=255)
    short_name = models.CharField(max_length=100, blank=True)
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="children",
    )
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    handles_confidential = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("sort_order", "name")
        verbose_name = _("department")
        verbose_name_plural = _("departments")
        constraints = [
            models.UniqueConstraint(
                fields=("agency", "code"),
                name="uniq_department_code_per_agency",
            ),
            models.UniqueConstraint(
                fields=("agency", "name"),
                name="uniq_department_name_per_agency",
            ),
        ]
        indexes = [
            models.Index(fields=("agency", "is_active")),
            models.Index(fields=("parent",)),
            models.Index(fields=("sort_order", "name")),
        ]

    def __str__(self) -> str:
        return f"{self.name} ({self.agency})"

    @property
    def display_name(self) -> str:
        return self.short_name or self.name

    def clean(self) -> None:
        super().clean()

        if self.parent_id and self.parent_id == self.id:
            raise ValidationError(
                {"parent": _("A department cannot be its own parent.")}
            )

        if self.parent and self.parent.agency_id != self.agency_id:
            raise ValidationError(
                {"parent": _("Parent department must belong to the same agency.")}
            )
