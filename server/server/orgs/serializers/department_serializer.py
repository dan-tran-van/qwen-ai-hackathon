from __future__ import annotations

from typing import Any

from rest_framework import serializers

from server.orgs.models.department_model import Agency
from server.orgs.models.department_model import Department


class DepartmentSerializer(serializers.ModelSerializer[Department]):
    agency_name = serializers.CharField(source="agency.name", read_only=True)
    parent_name = serializers.CharField(source="parent.name", read_only=True)
    children_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Department
        fields = (
            "id",
            "agency",
            "agency_name",
            "code",
            "name",
            "short_name",
            "parent",
            "parent_name",
            "sort_order",
            "is_active",
            "handles_confidential",
            "children_count",
            "created_at",
            "updated_at",
        )

    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        agency: Agency | None = attrs.get("agency")
        parent: Department | None = attrs.get("parent")

        if self.instance is not None:
            agency = agency or self.instance.agency
            parent = parent if "parent" in attrs else self.instance.parent

        if parent is not None and agency is not None and parent.agency_id != agency.id:
            raise serializers.ValidationError(
                {"parent": "Parent department must belong to the same agency."}
            )

        if (
            self.instance is not None
            and parent is not None
            and parent.id == self.instance.id
        ):
            raise serializers.ValidationError(
                {"parent": "A department cannot be its own parent."}
            )

        return attrs


class DepartmentTreeNodeSerializer(serializers.Serializer[dict[str, Any]]):
    id = serializers.UUIDField()
    agency_id = serializers.UUIDField()
    parent_id = serializers.UUIDField(allow_null=True)
    code = serializers.CharField()
    name = serializers.CharField()
    short_name = serializers.CharField(allow_blank=True)
    sort_order = serializers.IntegerField()
    is_active = serializers.BooleanField()
    handles_confidential = serializers.BooleanField()
    children = serializers.SerializerMethodField()

    def get_children(self, obj: dict[str, Any]) -> list[dict[str, Any]]:
        serializer = DepartmentTreeNodeSerializer(
            obj.get("children", []),
            many=True,
            context=self.context,
        )
        return serializer.data
