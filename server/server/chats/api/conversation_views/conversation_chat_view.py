from drf_spectacular.utils import extend_schema
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from server.chats.models.conversation_model import Conversation
from server.chats.serializers.message_serializer import MessageSerializer
from server.chats.serializers.message_serializers.message_chat_serializer import (
    MessageChatSerializer,
)
from server.chats.services.add_user_message import add_user_message
from server.chats.services.generate_assistant_message import generate_assistant_reply


class ConversationChatView(generics.GenericAPIView):
    """
    API view to handle chat interactions within a conversation.
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=MessageChatSerializer,
        responses=MessageSerializer,
    )
    def post(self, request, conversation_id, *args, **kwargs):
        conversation = Conversation.objects.get(id=conversation_id, user=request.user)
        data = {
            "content": request.data.get("content"),
        }
        serializer = MessageChatSerializer(
            context={"request": request, "conversation": conversation},
            data=data,
        )
        serializer.is_valid(raise_exception=True)
        add_user_message(
            conversation=conversation,
            content=serializer.validated_data["content"],
        )
        reply = generate_assistant_reply(conversation=conversation)
        return Response(MessageSerializer(reply).data)
