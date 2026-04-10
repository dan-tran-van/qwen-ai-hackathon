from __future__ import annotations

from django.db import models
from django_stubs_ext.db.models import TypedModelMeta

from server.chats.models.time_stamped_model import TimeStampedModel


class Message(TimeStampedModel):
    class Role(models.TextChoices):
        SYSTEM = "system", "System"
        USER = "user", "User"
        ASSISTANT = "assistant", "Assistant"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"

    conversation = models.ForeignKey(
        "Conversation",
        on_delete=models.CASCADE,
        related_name="messages",
    )
    role = models.CharField(max_length=16, choices=Role.choices)
    content = models.TextField()
    order = models.PositiveIntegerField()
    status = models.CharField(
        max_length=16,
        choices=Status.choices,
        default=Status.COMPLETED,
    )
    error_message = models.TextField(blank=True)

    class Meta(TypedModelMeta):
        ordering = ["order", "created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["conversation", "order"],
                name="uniq_message_order_per_conversation",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.role} message #{self.order}"
