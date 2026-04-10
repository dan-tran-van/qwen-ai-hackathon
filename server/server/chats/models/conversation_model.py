import uuid

from django.db import models
from django_stubs_ext.db.models import TypedModelMeta

from config.settings import base
from server.chats.models.time_stamped_model import TimeStampedModel

# Create your models here.


class Conversation(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        base.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="conversations",
    )
    title = models.CharField(max_length=255, blank=True)
    system_prompt = models.TextField(blank=True)
    last_message_at = models.DateTimeField(null=True, blank=True)

    class Meta(TypedModelMeta):
        ordering = ["-last_message_at", "-created_at"]

    def __str__(self) -> str:
        return self.title or f"Conversation {self.pk}"
