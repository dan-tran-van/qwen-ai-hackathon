from rest_framework import serializers

from server.chats.models.conversation_model import Conversation


class ConversationCreateSerializer(serializers.ModelSerializer[Conversation]):
    class Meta:
        model = Conversation
        fields = ["id", "title", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def create(self, validated_data):
        user = self.context["request"].user
        return Conversation.objects.create(user=user, **validated_data)
