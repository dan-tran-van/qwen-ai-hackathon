from rest_framework import serializers

from server.chats.models.conversation_model import Conversation


class ConversationSerializer(serializers.ModelSerializer[Conversation]):
    class Meta:
        model = Conversation
        fields = ["id", "user", "title", "system_prompt", "last_message_at"]
        read_only_fields = ["id", "user", "last_message_at"]
