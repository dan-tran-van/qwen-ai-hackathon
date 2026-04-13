from django.urls import path

from server.chats.api.conversation_views.conversation_chat_view import (
    ConversationChatView,
)
from server.chats.api.conversation_views.conversation_detail_view import (
    ConversationDetailView,
)
from server.chats.api.conversation_views.conversation_last_7_days_list import (
    ConversationLast7DaysListView,
)
from server.chats.api.conversation_views.conversation_list_view import (
    ConversationListView,
)
from server.chats.api.conversation_views.conversation_today_list import (
    ConversationTodayListView,
)
from server.chats.api.conversation_views.converstaion_create_view import (
    ConversationCreateView,
)
from server.chats.api.message_views.message_create_view import MessageCreateView

urlpatterns = [
    path("conversations/", ConversationListView.as_view(), name="conversation-list"),
    path(
        "conversations/today/",
        ConversationTodayListView.as_view(),
        name="conversation-today-list",
    ),
    path(
        "conversations/last-7-days/",
        ConversationLast7DaysListView.as_view(),
        name="conversation-last-7-days-list",
    ),
    path(
        "conversations/<uuid:pk>/",
        ConversationDetailView.as_view(),
        name="conversation-detail",
    ),
    path(
        "conversations/create/",
        ConversationCreateView.as_view(),
        name="conversation-create",
    ),
    path(
        "conversations/<uuid:conversation_id>/chat",
        ConversationChatView.as_view(),
        name="conversation-chat",
    ),
]
