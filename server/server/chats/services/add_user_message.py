from django.db import transaction
from django.utils import timezone

from server.chats.models.conversation_model import Conversation
from server.chats.models.message_model import Message


@transaction.atomic
def add_user_message(conversation: Conversation, content: str) -> Message:
    last_message = conversation.messages.select_for_update().order_by("-order").first()
    next_order = 1 if last_message is None else last_message.order + 1

    message = Message.objects.create(
        conversation=conversation,
        role=Message.Role.USER,
        content=content,
        order=next_order,
        status=Message.Status.COMPLETED,
    )

    conversation.last_message_at = timezone.now()
    if not conversation.title.strip():
        conversation.title = content[:80]
    conversation.save(update_fields=["title", "last_message_at", "updated_at"])

    return message
