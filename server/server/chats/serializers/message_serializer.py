from rest_framework import serializers

from server.chats.models.message_model import Message


class MessageSerialzier(serializers.ModelSerializer[Message]):
    class Meta:
        model = Message
        fields = [
            "id",
            "conversation",
            "role",
            "content",
            "order",
            "status",
            "error_message",
        ]
        read_only_fields = ["id", "conversation", "order", "status", "error_message"]
