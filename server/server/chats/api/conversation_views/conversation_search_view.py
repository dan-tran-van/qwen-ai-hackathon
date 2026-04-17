from django.db.models import Q
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiExample
from drf_spectacular.utils import OpenApiParameter
from drf_spectacular.utils import extend_schema
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from server.chats.models.conversation_model import Conversation
from server.chats.serializers.conversation_serializer import ConversationSerializer


@extend_schema(
    summary="Search conversations",
    description=(
        "Search authenticated user's conversations by keyword. "
        "Matches against conversation title, system prompt, and message content."
    ),
    parameters=[
        OpenApiParameter(
            name="q",
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            required=False,
            description="Search keyword. If omitted, returns all conversations.",
            examples=[
                OpenApiExample(name="Invoice", value="invoice"),
                OpenApiExample(name="Meeting Notes", value="meeting notes"),
            ],
        ),
    ],
    responses={200: ConversationSerializer(many=True)},
)
class ConversationSearchView(generics.ListAPIView):
    """
    API view to search conversations for the authenticated user.

    Query param:
    - q: search keyword matched against conversation title, system prompt,
      and message content.
    """

    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.query_params.get("q", "").strip()
        queryset = Conversation.objects.filter(user=self.request.user)

        if query:
            queryset = queryset.filter(
                Q(title__icontains=query)
                | Q(system_prompt__icontains=query)
                | Q(messages__content__icontains=query),
            ).distinct()

        return queryset.order_by("-last_message_at", "-created_at")
