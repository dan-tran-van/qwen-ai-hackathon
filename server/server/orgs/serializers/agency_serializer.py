from __future__ import annotations

from typing import Any

from rest_framework import serializers

from server.orgs.models.agency_model import Agency


class AgencySerializer(serializers.ModelSerializer[Agency]):
    parent_name = serializers.CharField(source="parent.name", read_only=True)
    children_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Agency
        fields = (
            "id",
            "code",
            "name",
            "short_name",
            "parent",
            "parent_name",
            "is_active",
            "children_count",
            "created_at",
            "updated_at",
        )

    def validate_parent(self, value: Agency | None) -> Agency | None:
        instance = getattr(self, "instance", None)
        if instance is not None and value is not None and value.id == instance.id:
            raise serializers.ValidationError("An agency cannot be its own parent.")
        return value
