from rest_framework import serializers

from server.chats.models.conversation_model import Conversation
from server.chats.serializers.message_serializer import Message


class MessageChatSerializer(serializers.ModelSerializer[Message]):
    class Meta:
        model = Message
        fields = ["conversation", "content"]

    def validate(self, attrs):
        user = self.context["request"].user
        conversation = attrs["conversation"]
        if conversation.user != user:
            exception = serializers.ValidationError(
                "You do not have permission to add messages to this conversation."
            )
            raise exception
        return attrs
