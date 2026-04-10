import os

from openai import OpenAI


def get_qwen_client() -> OpenAI:
    return OpenAI(
        # If the environment variable is not set, replace the following line with: api_key="sk-xxx"
        api_key=os.getenv("DASHSCOPE_API_KEY"),
        # The following is the base_url for the Singapore region.
        base_url="https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    )
