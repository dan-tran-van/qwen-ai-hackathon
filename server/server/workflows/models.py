from django.db import models
from model_utils.models import TimeStampedModel

from server.documents.models import Department


class WorkflowStep(TimeStampedModel):
    stage = models.CharField(max_length=255)
    department = models.CharField(choices=Department.choices, max_length=50)
    assignee = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=[
            ("completed", "Completed"),
            ("current", "Current"),
            ("pending", "Pending"),
        ],
    )
    date = models.DateTimeField(null=True, blank=True)
    note = models.TextField(blank=True)

    def __str__(self):
        return f"{self.stage} - {self.department} - {self.assignee} - {self.status}"
