from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from server.chats.models.conversation_model import Conversation
from server.chats.models.message_model import Message
from server.chats.serializers.message_serializer import MessageSerializer


class ConversationDetailView(generics.GenericAPIView):
    """
    API view to retrieve details of a specific conversation, including its messages.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, pk, *args, **kwargs):
        conversation_id = pk
        conversation = Conversation.objects.get(id=conversation_id, user=request.user)
        messages = Message.objects.filter(conversation=conversation).order_by(
            "created_at",
        )
        return Response(
            {
                "conversation": {
                    "id": conversation.id,
                    "title": conversation.title,
                    "created_at": conversation.created_at,
                    "last_message_at": conversation.last_message_at,
                },
                "messages": MessageSerializer(messages, many=True).data,
            },
        )
