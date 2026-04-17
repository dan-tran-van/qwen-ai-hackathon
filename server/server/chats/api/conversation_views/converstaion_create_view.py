from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from server.chats.serializers.conversation_serializers.conversation_create_serializer import (
    ConversationCreateSerializer,
)


class ConversationCreateView(generics.CreateAPIView):
    """
    API view to create a new conversation for the authenticated user.

    Accepts the first message from the user and automatically generates
    a conversation title based on the message content.
    """

    serializer_class = ConversationCreateSerializer
    permission_classes = [IsAuthenticated]
