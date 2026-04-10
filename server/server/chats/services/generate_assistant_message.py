from django.db import transaction
from django.utils import timezone

from server.chats.models.conversation_model import Conversation
from server.chats.models.message_model import Message
from server.chats.services.build_openai_messages import build_openai_messages
from server.chats.services.get_qwen_client import get_qwen_client


@transaction.atomic
def generate_assistant_reply(
    conversation: Conversation,
    model: str = "qwen-plus",
) -> Message:
    last_message = conversation.messages.select_for_update().order_by("-order").first()
    next_order = 1 if last_message is None else last_message.order + 1

    pending_message = Message.objects.create(
        conversation=conversation,
        role=Message.Role.ASSISTANT,
        content="",
        order=next_order,
        status=Message.Status.PENDING,
    )

    try:
        client = get_qwen_client()
        api_messages = build_openai_messages(conversation)

        completion = client.chat.completions.create(
            model=model,
            messages=api_messages,
        )

        assistant_content = (
            completion.choices[0].message.content
            if completion.choices and completion.choices[0].message.content
            else ""
        )

        pending_message.content = assistant_content
        pending_message.status = Message.Status.COMPLETED
        pending_message.error_message = ""
        pending_message.save(
            update_fields=["content", "status", "error_message", "updated_at"]
        )

        conversation.last_message_at = timezone.now()
        conversation.save(update_fields=["last_message_at", "updated_at"])

        return pending_message

    except Exception as exc:
        pending_message.status = Message.Status.FAILED
        pending_message.error_message = str(exc)
        pending_message.save(update_fields=["status", "error_message", "updated_at"])
        raise
