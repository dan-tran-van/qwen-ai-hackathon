import os

from openai import OpenAI

client = OpenAI(
    # If the environment variable is not set, replace the following line with: api_key="sk-xxx"
    api_key=os.getenv("DASHSCOPE_API_KEY"),
    # The following is the base_url for the Singapore region.
    base_url="https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
)

completion = client.chat.completions.create(
    model="qwen-plus",  # Model list: https://www.alibabacloud.com/help/en/model-studio/getting-started/models
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who are you?"},
    ],
    # extra_body={"enable_thinking": False},
)
print(completion.model_dump_json())
