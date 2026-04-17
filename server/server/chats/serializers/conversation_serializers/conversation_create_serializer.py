from rest_framework import serializers

from server.chats.models.conversation_model import Conversation
from server.chats.services.add_user_message import add_user_message
from server.chats.services.generate_assistant_message import generate_assistant_reply


class ConversationCreateSerializer(serializers.ModelSerializer[Conversation]):
    content = serializers.CharField(
        write_only=True, help_text="The first message content from the user"
    )

    class Meta:
        model = Conversation
        fields = ["id", "title", "created_at", "updated_at", "content"]
        read_only_fields = ["id", "title", "created_at", "updated_at"]

    def create(self, validated_data):
        user = self.context["request"].user
        content = validated_data.pop("content")

        # Create the conversation
        conversation = Conversation.objects.create(user=user, **validated_data)

        # Add the user's first message and generate title
        add_user_message(conversation, content)

        # Generate AI assistant response
        generate_assistant_reply(conversation)

        return conversation
