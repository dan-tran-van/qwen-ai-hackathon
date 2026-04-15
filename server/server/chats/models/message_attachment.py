from django.db import models

from server.chats.models.message_model import Message


class MessageAttachment(models.Model):
    message = models.ForeignKey(
        Message, related_name="attachments", on_delete=models.CASCADE
    )
    file = models.FileField(upload_to="message_attachments/")
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50)
    file_size = models.PositiveIntegerField()

    def __str__(self) -> str:
        return f"Attachment for {self.message} - {self.file_name}"
