import mimetypes
import os
from dataclasses import dataclass
from enum import StrEnum
from pathlib import Path
from typing import TYPE_CHECKING
from typing import Any
from typing import Literal

from openai import OpenAI
from pydantic import BaseModel
from pydantic import Field

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
    DOCUMENT = "DOCUMENT"
    FORM = "FORM"
    ANNOUNCEMENT = "ANNOUNCEMENT"
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
    received_date: str | None = None
    summary: str
    confidentiality: ConfidentialityLevel
    department: Department
    document_type: DocumentType
    status: DocumentStatus
    ai_confidence: float
    subject: str
    deadline: str | None = None

    suggested_reviewer: str | None = None
    suggested_dept: str | None = None

    entities: list[str] = Field(default_factory=list)
    risk_flags: list[str] = Field(default_factory=list)
    related_docs: list[str] = Field(default_factory=list)


AttachmentInputType = Literal["input_file", "input_image"]


@dataclass(frozen=True, slots=True)
class UploadedAttachment:
    file_id: str
    filename: str
    content_type: str
    input_type: AttachmentInputType


IMAGE_MIME_TYPES: set[str] = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/tiff",
}


def get_openai_client() -> OpenAI:
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def _normalize_content_type(content_type: str | None) -> str:
    if not content_type:
        return "application/octet-stream"
    return content_type.split(";", 1)[0].strip().lower()


def _guess_attachment_content_type(attachment: WorkflowDocumentAttachment) -> str:
    filename = Path(attachment.file.name).name
    guessed_content_type, _ = mimetypes.guess_type(filename)

    # May exist for InMemoryUploadedFile / TemporaryUploadedFile, but not always.
    uploaded_content_type = getattr(attachment.file, "content_type", None)

    return _normalize_content_type(
        uploaded_content_type or guessed_content_type or "application/octet-stream"
    )


def _resolve_attachment_input_type(content_type: str) -> AttachmentInputType:
    if content_type in IMAGE_MIME_TYPES:
        return "input_image"
    return "input_file"


def upload_workflow_document_attachment_to_openai(
    attachment: WorkflowDocumentAttachment,
) -> UploadedAttachment:
    client = get_openai_client()

    attachment.file.open("rb")
    try:
        file_bytes = attachment.file.read()
        filename = Path(attachment.file.name).name
        content_type = _guess_attachment_content_type(attachment)

        uploaded_file = client.files.create(
            file=(filename, file_bytes, content_type),
            purpose="user_data",
        )
    finally:
        attachment.file.close()

    return UploadedAttachment(
        file_id=uploaded_file.id,
        filename=filename,
        content_type=content_type,
        input_type=_resolve_attachment_input_type(content_type),
    )


def _build_attachment_content_part(uploaded: UploadedAttachment) -> dict[str, Any]:
    if uploaded.input_type == "input_image":
        return {
            "type": "input_image",
            "file_id": uploaded.file_id,
            # Use "auto" to save tokens, or "high" for better OCR-like extraction
            # from scanned forms/letters.
            "detail": "high",
        }

    return {
        "type": "input_file",
        "file_id": uploaded.file_id,
    }


def generate_workflow_document_ai_analysis(
    uploaded: UploadedAttachment,
) -> WorkflowDocument:
    client = get_openai_client()

    attachment_part = _build_attachment_content_part(uploaded)

    response = client.responses.create(
        model="gpt-5",
        input=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": (
                            "Analyze this uploaded government document. "
                            "The attachment may be a PDF, office document, "
                            "or a scanned/photo image of a document. "
                            "Extract the following fields as JSON: "
                            "title, code, sender, received_date, summary, "
                            "deadline, confidentiality, department, "
                            "document_type, status, ai_confidence, subject, "
                            "suggested_reviewer, suggested_dept, entities, "
                            "risk_flags, related_docs. "
                            "If a value cannot be determined, return null for nullable "
                            "fields, an empty array for array fields, and choose the "
                            "closest valid enum only when the document strongly supports it. "
                            "Use these enums exactly:\n"
                            "confidentiality: UNCLASSIFIED, CONFIDENTIAL, SECRET, TOP_SECRET\n"
                            "department: ADMIN, PLANNING, ENVIRONMENT, GENERAL, HUMAN_RESOURCES, MANAGEMENT, CLERK\n"
                            "document_type: OFFICIAL_LETTER, REPORT, DECISION, DOCUMENT, FORM, ANNOUNCEMENT, OTHER\n"
                            "status: NEW, IN_PROGRESS, PENDING_COORDINATION, PENDING_APPROVAL, OVERDUE, COMPLETED"
                            "The response should be in Vietnamese for summary and sender fields, but other fields should be in English. "
                        ),
                    },
                    attachment_part,
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
                        "received_date": {"type": ["string", "null"]},
                        "summary": {"type": "string"},
                        "deadline": {"type": ["string", "null"]},
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
                            "enum": [
                                "OFFICIAL_LETTER",
                                "REPORT",
                                "DECISION",
                                "DOCUMENT",
                                "FORM",
                                "ANNOUNCEMENT",
                                "OTHER",
                            ],
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
                        "suggested_reviewer": {"type": ["string", "null"]},
                        "suggested_dept": {"type": ["string", "null"]},
                        "entities": {"type": "array", "items": {"type": "string"}},
                        "risk_flags": {"type": "array", "items": {"type": "string"}},
                        "related_docs": {"type": "array", "items": {"type": "string"}},
                    },
                    "required": [
                        "title",
                        "code",
                        "sender",
                        "received_date",
                        "summary",
                        "deadline",
                        "confidentiality",
                        "department",
                        "document_type",
                        "status",
                        "ai_confidence",
                        "subject",
                        "suggested_reviewer",
                        "suggested_dept",
                        "entities",
                        "risk_flags",
                        "related_docs",
                    ],
                },
            }
        },
    )

    return WorkflowDocument.model_validate_json(response.output_text)


def generate_response_with_workflow_document_attachment(
    attachment: "WorkflowDocumentAttachment",
) -> WorkflowDocument:
    uploaded = upload_workflow_document_attachment_to_openai(attachment)
    return generate_workflow_document_ai_analysis(uploaded)


def generate_workflow_response_from_workflow_document(
    workflow_document: WorkflowDocument,
    attachment_id: str | None = None,
) -> str:
    client = get_openai_client()

    response = client.responses.create(
        model="gpt-5",
        input=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": (
                            "You are a helpful assistant for government document processing. "
                            "Based on the following government document information, "
                            "draft the final response to issue to the relevant citizen/stake holder. "
                        ),
                    },
                    {
                        "type": "input_text",
                        "text": workflow_document.model_dump_json(),
                    },
                ],
            }
        ],
        text={
            "format": {
                "type": "json_schema",
                "name": "workflow_response",
                "schema": {
                    "type": "object",
                    "additionalProperties": False,
                    "properties": {
                        "next_stage": {"type": "string"},
                        "assignee": {"type": ["string", "null"]},
                        "notes": {"type": ["string", "null"]},
                    },
                    "required": ["next_stage", "assignee", "notes"],
                },
            }
        },
    )

    return response.output_text
