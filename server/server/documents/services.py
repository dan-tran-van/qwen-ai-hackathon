import os
from enum import StrEnum
from pathlib import Path
from typing import TYPE_CHECKING

from openai import OpenAI
from pydantic import BaseModel

if TYPE_CHECKING:
    from server.documents.models import WorkflowDocumentAttachment


class ConfidentialityLevel(StrEnum):
    UNCLASSIFIED = "UNCLASSIFIED"
    CONFIDENTIAL = "CONFIDENTIAL"
    SECRET = "SECRET"
    TOP_SECRET = "TOP_SECRET"


class DocumentType(StrEnum):
    OFFICIAL_LETTER = "OFFICIAL_LETTER"
    REPORT = "REPORT"
    DECISION = "DECISION"
    OTHER = "OTHER"


class Department(StrEnum):
    ADMIN = "ADMIN"
    PLANNING = "PLANNING"
    ENVIRONMENT = "ENVIRONMENT"
    GENERAL = "GENERAL"
    HUMAN_RESOURCES = "HUMAN_RESOURCES"
    MANAGEMENT = "MANAGEMENT"
    CLERK = "CLERK"


class DocumentStatus(StrEnum):
    NEW = "NEW"
    IN_PROGRESS = "IN_PROGRESS"
    PENDING_COORDINATION = "PENDING_COORDINATION"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    OVERDUE = "OVERDUE"
    COMPLETED = "COMPLETED"


class WorkflowDocument(BaseModel):
    title: str
    code: str
    sender: str
    received_date: str
    summary: str
    confidentiality: ConfidentialityLevel
    department: Department
    document_type: DocumentType
    status: DocumentStatus
    ai_confidence: float
    subject: str


def get_openai_client() -> OpenAI:
    return OpenAI(
        api_key=os.getenv("OPENAI_API_KEY"),
    )


def upload_file_to_openai(file_path: str) -> str:
    client = get_openai_client()
    with Path(file_path).open("rb") as file_handle:
        uploaded_file = client.files.create(
            file=file_handle,
            purpose="user_data",
        )

    return uploaded_file.id


def upload_workflow_document_attachment_to_openai(
    attachment: WorkflowDocumentAttachment,
) -> str:
    client = get_openai_client()

    attachment.file.open("rb")
    try:
        file_bytes = attachment.file.read()
        filename = attachment.file.name.split("/")[-1]
        content_type = (
            getattr(attachment.file.file, "content_type", None)
            or "application/octet-stream"
        )

        uploaded_file = client.files.create(
            file=(filename, file_bytes, content_type),
            purpose="user_data",
        )
    finally:
        attachment.file.close()

    return uploaded_file.id


def generate_workflow_document_ai_analysis(file_id: str):

    client = get_openai_client()
    completion = client.chat.completions.parse(
        model="gpt-5",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "file",
                        "file": {
                            "file_id": file_id,
                        },
                    },
                    {
                        "type": "text",
                        "text": "Analyze the content of the file and extract relevant "
                        "information to populate the WorkflowDocument fields. Provide a"
                        " summary, determine the confidentiality level, document type, "
                        "department, and suggest an appropriate status based on the"
                        " content.",
                    },
                ],
            },
        ],
        response_format=WorkflowDocument,
    )
    return completion.choices[0].message.parsed or ""


def generate_response_with_workflow_document_attachment(
    attachment: WorkflowDocumentAttachment,
    user_message: str,
) -> str:
    file_id = upload_workflow_document_attachment_to_openai(attachment)
    return generate_workflow_document_ai_analysis(file_id, user_message)
