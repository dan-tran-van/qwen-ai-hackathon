from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from server.chats.models.conversation_model import Conversation
from server.chats.serializers.conversation_serializer import ConversationSerializer


class ConversationListView(generics.ListAPIView):
    """
    API view to list all conversations for the authenticated user.
    """

    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user).order_by(
            "-last_message_at",
        )
