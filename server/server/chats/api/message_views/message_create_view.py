from rest_framework import generics

from server.chats.models.message_model import Message
from server.chats.serializers.message_serializers.message_chat_serializer import (
    MessageChatSerializer,
)


class MessageCreateView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageChatSerializer
