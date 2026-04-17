from django.contrib import admin

from server.workflows.models import WorkflowStep

# Register your models here.


@admin.register(WorkflowStep)
class WorkflowStepAdmin(admin.ModelAdmin):
    list_display = ("stage", "department", "assignee", "status", "date")
    list_filter = ("department", "status")
    search_fields = ("stage", "assignee", "note")
