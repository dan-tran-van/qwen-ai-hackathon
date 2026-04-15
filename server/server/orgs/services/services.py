from __future__ import annotations

from collections import defaultdict
from typing import Any
from uuid import UUID

from django.db import transaction
from django.db.models import Count
from django.db.models import QuerySet

from server.orgs.models.agency_model import Agency
from server.orgs.models.department_model import Department


def parse_bool(value: str | None, *, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


class OrganizationService:
    @staticmethod
    def list_agencies(*, include_inactive: bool = False) -> QuerySet[Agency]:
        queryset: QuerySet[Agency] = (
            Agency.objects.select_related("parent")
            .annotate(children_count=Count("children", distinct=True))
            .order_by("name")
        )
        if not include_inactive:
            queryset = queryset.filter(is_active=True)
        return queryset

    @staticmethod
    def list_departments(
        *,
        agency_id: UUID | None = None,
        parent_id: UUID | None = None,
        include_inactive: bool = False,
    ) -> QuerySet[Department]:
        queryset: QuerySet[Department] = (
            Department.objects.select_related("agency", "parent")
            .annotate(children_count=Count("children", distinct=True))
            .order_by("sort_order", "name")
        )

        if agency_id is not None:
            queryset = queryset.filter(agency_id=agency_id)

        if parent_id is not None:
            queryset = queryset.filter(parent_id=parent_id)

        if not include_inactive:
            queryset = queryset.filter(is_active=True)

        return queryset

    @staticmethod
    @transaction.atomic
    def create_agency(*, data: dict[str, Any]) -> Agency:
        agency = Agency(**data)
        agency.full_clean()
        agency.save()
        return agency

    @staticmethod
    @transaction.atomic
    def update_agency(*, agency: Agency, data: dict[str, Any]) -> Agency:
        for field, value in data.items():
            setattr(agency, field, value)

        agency.full_clean()
        agency.save()
        return agency

    @staticmethod
    @transaction.atomic
    def create_department(*, data: dict[str, Any]) -> Department:
        department = Department(**data)
        department.full_clean()
        department.save()
        return department

    @staticmethod
    @transaction.atomic
    def update_department(
        *, department: Department, data: dict[str, Any]
    ) -> Department:
        for field, value in data.items():
            setattr(department, field, value)

        department.full_clean()
        department.save()
        return department

    @staticmethod
    def build_department_tree(
        *,
        agency_id: UUID | None = None,
        include_inactive: bool = False,
    ) -> list[dict[str, Any]]:
        departments = list(
            OrganizationService.list_departments(
                agency_id=agency_id,
                include_inactive=include_inactive,
            )
        )

        children_map: dict[UUID | None, list[Department]] = defaultdict(list)
        for department in departments:
            children_map[department.parent_id].append(department)

        def build_node(department: Department) -> dict[str, Any]:
            return {
                "id": department.id,
                "agency_id": department.agency_id,
                "parent_id": department.parent_id,
                "code": department.code,
                "name": department.name,
                "short_name": department.short_name,
                "sort_order": department.sort_order,
                "is_active": department.is_active,
                "handles_confidential": department.handles_confidential,
                "children": [
                    build_node(child) for child in children_map.get(department.id, [])
                ],
            }

        roots = children_map.get(None, [])
        return [build_node(root) for root in roots]
