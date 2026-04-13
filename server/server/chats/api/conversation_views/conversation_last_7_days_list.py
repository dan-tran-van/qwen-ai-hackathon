from datetime import timedelta

from django.utils import timezone
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from server.chats.models.conversation_model import Conversation
from server.chats.serializers.conversation_serializer import ConversationSerializer


class ConversationLast7DaysListView(generics.ListAPIView):
    """
    API view to list conversations from the last 7 days for the authenticated user.
    """

    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(
            user=self.request.user,
            last_message_at__gte=timezone.now() - timedelta(days=7),
        ).order_by("-last_message_at")
