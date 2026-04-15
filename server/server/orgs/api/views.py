from __future__ import annotations

from typing import Any
from uuid import UUID

from django.http import Http404
from rest_framework import permissions
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from server.orgs.models.agency_model import Agency
from server.orgs.models.department_model import Department
from server.orgs.serializers.agency_serializer import AgencySerializer
from server.orgs.serializers.department_serializer import DepartmentSerializer
from server.orgs.serializers.department_serializer import DepartmentTreeNodeSerializer
from server.orgs.services.services import OrganizationService
from server.orgs.services.services import parse_bool


class IsStaffOrReadOnly(permissions.BasePermission):
    def has_permission(self, request: Request, view) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)
        return bool(request.user and request.user.is_staff)


class AgencyViewSet(viewsets.ModelViewSet[Agency]):
    serializer_class = AgencySerializer
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = "id"

    def get_queryset(self):
        include_inactive = parse_bool(
            self.request.query_params.get("include_inactive"),
            default=False,
        )
        return OrganizationService.list_agencies(include_inactive=include_inactive)

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        agency = OrganizationService.create_agency(data=dict(serializer.validated_data))
        output = self.get_serializer(agency)

        headers = self.get_success_headers(output.data)
        return Response(output.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        partial = kwargs.pop("partial", False)
        agency = self.get_object()

        serializer = self.get_serializer(agency, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        updated = OrganizationService.update_agency(
            agency=agency,
            data=dict(serializer.validated_data),
        )
        output = self.get_serializer(updated)
        return Response(output.data)

    @action(detail=True, methods=["get"], url_path="departments")
    def departments(self, request: Request, id: str | None = None) -> Response:
        agency = self.get_object()
        include_inactive = parse_bool(
            request.query_params.get("include_inactive"),
            default=False,
        )

        departments = OrganizationService.list_departments(
            agency_id=agency.id,
            include_inactive=include_inactive,
        )
        serializer = DepartmentSerializer(
            departments, many=True, context=self.get_serializer_context()
        )
        return Response(serializer.data)


class DepartmentViewSet(viewsets.ModelViewSet[Department]):
    serializer_class = DepartmentSerializer
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = "id"

    def get_queryset(self):
        agency_id_raw = self.request.query_params.get("agency_id")
        parent_id_raw = self.request.query_params.get("parent_id")
        include_inactive = parse_bool(
            self.request.query_params.get("include_inactive"),
            default=False,
        )

        agency_id: UUID | None = None
        parent_id: UUID | None = None

        if agency_id_raw:
            try:
                agency_id = UUID(agency_id_raw)
            except ValueError as exc:
                raise Http404("Invalid agency_id.") from exc

        if parent_id_raw:
            try:
                parent_id = UUID(parent_id_raw)
            except ValueError as exc:
                raise Http404("Invalid parent_id.") from exc

        return OrganizationService.list_departments(
            agency_id=agency_id,
            parent_id=parent_id,
            include_inactive=include_inactive,
        )

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        department = OrganizationService.create_department(
            data=dict(serializer.validated_data)
        )
        output = self.get_serializer(department)

        headers = self.get_success_headers(output.data)
        return Response(output.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        partial = kwargs.pop("partial", False)
        department = self.get_object()

        serializer = self.get_serializer(
            department,
            data=request.data,
            partial=partial,
        )
        serializer.is_valid(raise_exception=True)

        updated = OrganizationService.update_department(
            department=department,
            data=dict(serializer.validated_data),
        )
        output = self.get_serializer(updated)
        return Response(output.data)

    @action(detail=False, methods=["get"], url_path="tree")
    def tree(self, request: Request) -> Response:
        agency_id_raw = request.query_params.get("agency_id")
        include_inactive = parse_bool(
            request.query_params.get("include_inactive"),
            default=False,
        )

        agency_id: UUID | None = None
        if agency_id_raw:
            try:
                agency_id = UUID(agency_id_raw)
            except ValueError as exc:
                raise Http404("Invalid agency_id.") from exc

        tree_data = OrganizationService.build_department_tree(
            agency_id=agency_id,
            include_inactive=include_inactive,
        )
        serializer = DepartmentTreeNodeSerializer(tree_data, many=True)
        return Response(serializer.data)
