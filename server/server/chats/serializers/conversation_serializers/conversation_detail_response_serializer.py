from rest_framework import serializers

from server.chats.serializers.conversation_serializer import ConversationSerializer
from server.chats.serializers.message_serializer import MessageSerializer


class ConversationDetailResponseSerializer(serializers.Serializer):
    conversation = ConversationSerializer()
    messages = MessageSerializer(many=True)
