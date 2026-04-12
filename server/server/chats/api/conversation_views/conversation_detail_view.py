from drf_spectacular.utils import extend_schema
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from server.chats.models.conversation_model import Conversation
from server.chats.models.message_model import Message
from server.chats.serializers.conversation_serializers.conversation_detail_response_serializer import (
    ConversationDetailResponseSerializer,
)
from server.chats.serializers.message_serializer import MessageSerializer


@extend_schema(
    request=None,
    responses={
        200: {
            "conversation": {
                "id": "UUID",
                "title": "string",
                "created_at": "datetime",
                "last_message_at": "datetime",
            },
            "messages": MessageSerializer,
        },
    },
)
class ConversationDetailView(generics.GenericAPIView):
    """
    API view to retrieve details of a specific conversation, including its messages.
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=None,
        responses={
            200: ConversationDetailResponseSerializer,
        },
    )
    def get(self, request, pk, *args, **kwargs):
        conversation_id = pk
        conversation = Conversation.objects.get(id=conversation_id, user=request.user)
        messages = Message.objects.filter(conversation=conversation).order_by(
            "created_at",
        )
        return Response(
            ConversationDetailResponseSerializer(
                {
                    "conversation": conversation,
                    "messages": messages,
                },
            ).data,
        )
