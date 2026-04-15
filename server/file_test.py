import os

from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

file = client.files.create(file=open("test.pdf", "rb"), purpose="user_data")

completion = client.chat.completions.create(
    model="gpt-5",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "file",
                    "file": {
                        "file_id": file.id,
                    },
                },
                {
                    "type": "text",
                    "text": "Summarize the content of the file.",
                },
            ],
        }
    ],
)

print(completion.choices[0].message.content)
