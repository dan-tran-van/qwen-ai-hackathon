from server.chats.services.get_qwen_client import get_qwen_client


def generate_conversation_title(message_content: str, model: str = "qwen-plus") -> str:
    """
    Generate a concise title for a conversation based on the user's first message.

    Args:
        message_content: The user's first message
        model: The Qwen model to use for generation

    Returns:
        A generated conversation title
    """
    client = get_qwen_client()

    prompt = f"""Generate a concise and descriptive title (3-8 words maximum) for a conversation that starts with:

"{message_content}"

Return only the title, nothing else."""

    completion = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
    )

    title = (
        completion.choices[0].message.content.strip()
        if completion.choices and completion.choices[0].message.content
        else message_content[:80]
    )

    return title
