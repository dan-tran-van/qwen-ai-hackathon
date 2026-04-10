from server.chats.models.conversation_model import Conversation
from server.chats.models.message_model import Message


def build_openai_messages(conversation: Conversation) -> list[dict[str, str]]:
    messages: list[dict[str, str]] = []

    if conversation.system_prompt.strip():
        messages.append(
            {
                "role": "system",
                "content": conversation.system_prompt,
            }
        )

    db_messages = conversation.messages.filter(
        status=Message.Status.COMPLETED
    ).order_by("order")

    for message in db_messages:
        messages.append(
            {
                "role": message.role,
                "content": message.content,
            }
        )

    return messages
