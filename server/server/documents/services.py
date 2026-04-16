import mimetypes
import os
from enum import StrEnum
from pathlib import Path
from typing import TYPE_CHECKING
from typing import Any

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


def upload_workflow_document_attachment_to_openai(
    attachment: WorkflowDocumentAttachment,
) -> str:
    client = get_openai_client()

    attachment.file.open("rb")
    try:
        file_bytes = attachment.file.read()
        filename = Path(attachment.file.name).name

        guessed_content_type, _ = mimetypes.guess_type(filename)
        content_type = (
            getattr(attachment.file.file, "content_type", None)
            or guessed_content_type
            or "application/octet-stream"
        )

        uploaded_file = client.files.create(
            file=(filename, file_bytes, content_type),
            purpose="user_data",
        )
    finally:
        attachment.file.close()

    return uploaded_file.id


def generate_workflow_document_ai_analysis(file_id: str) -> WorkflowDocument:
    client = get_openai_client()

    response = client.responses.create(
        model="gpt-5",
        input=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_file",
                        "file_id": file_id,
                    },
                    {
                        "type": "input_text",
                        "text": (
                            "Analyze this document and extract the following fields as JSON: "
                            "title, code, sender, received_date, summary, confidentiality, "
                            "department, document_type, status, ai_confidence, subject. "
                            "Use these enums exactly:\n"
                            "confidentiality: UNCLASSIFIED, CONFIDENTIAL, SECRET, TOP_SECRET\n"
                            "department: ADMIN, PLANNING, ENVIRONMENT, GENERAL, HUMAN_RESOURCES, MANAGEMENT, CLERK\n"
                            "document_type: OFFICIAL_LETTER, REPORT, DECISION, OTHER\n"
                            "status: NEW, IN_PROGRESS, PENDING_COORDINATION, PENDING_APPROVAL, OVERDUE, COMPLETED"
                        ),
                    },
                ],
            }
        ],
        text={
            "format": {
                "type": "json_schema",
                "name": "workflow_document",
                "schema": {
                    "type": "object",
                    "additionalProperties": False,
                    "properties": {
                        "title": {"type": "string"},
                        "code": {"type": "string"},
                        "sender": {"type": "string"},
                        "received_date": {"type": "string"},
                        "summary": {"type": "string"},
                        "confidentiality": {
                            "type": "string",
                            "enum": [
                                "UNCLASSIFIED",
                                "CONFIDENTIAL",
                                "SECRET",
                                "TOP_SECRET",
                            ],
                        },
                        "department": {
                            "type": "string",
                            "enum": [
                                "ADMIN",
                                "PLANNING",
                                "ENVIRONMENT",
                                "GENERAL",
                                "HUMAN_RESOURCES",
                                "MANAGEMENT",
                                "CLERK",
                            ],
                        },
                        "document_type": {
                            "type": "string",
                            "enum": ["OFFICIAL_LETTER", "REPORT", "DECISION", "OTHER"],
                        },
                        "status": {
                            "type": "string",
                            "enum": [
                                "NEW",
                                "IN_PROGRESS",
                                "PENDING_COORDINATION",
                                "PENDING_APPROVAL",
                                "OVERDUE",
                                "COMPLETED",
                            ],
                        },
                        "ai_confidence": {"type": "number"},
                        "subject": {"type": "string"},
                    },
                    "required": [
                        "title",
                        "code",
                        "sender",
                        "received_date",
                        "summary",
                        "confidentiality",
                        "department",
                        "document_type",
                        "status",
                        "ai_confidence",
                        "subject",
                    ],
                },
            }
        },
    )

    analysis = WorkflowDocument.model_validate_json(response.output_text)
    return analysis


def generate_response_with_workflow_document_attachment(
    attachment: WorkflowDocumentAttachment,
):
    file_id = upload_workflow_document_attachment_to_openai(attachment)
    return generate_workflow_document_ai_analysis(file_id)
