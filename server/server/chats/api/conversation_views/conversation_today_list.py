from datetime import timedelta

from django.utils import timezone
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from server.chats.models.conversation_model import Conversation
from server.chats.serializers.conversation_serializer import ConversationSerializer


class ConversationTodayListView(generics.ListAPIView):
    """
    API view to list conversations from today for the authenticated user.
    """

    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(
            user=self.request.user,
            last_message_at__gte=timezone.now().replace(
                hour=0,
                minute=0,
                second=0,
                microsecond=0,
            ),
        ).order_by("-last_message_at")
