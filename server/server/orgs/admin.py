from django.contrib import admin

from server.orgs.models.agency_model import Agency
from server.orgs.models.department_model import Department

# Register your models here.


@admin.register(Agency)
class AgencyAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_at")
    search_fields = ("name",)
    list_filter = ("created_at",)


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "agency", "created_at")
    search_fields = ("name",)
    list_filter = ("created_at", "agency")
