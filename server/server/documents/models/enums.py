from __future__ import annotations

from django.db import models


class ConfidentialityLevel(models.TextChoices):
    NORMAL = "normal", "Thường"
    SECRET = "secret", "Mật"
    TOP_SECRET = "top_secret", "Tối mật"
    ABSOLUTE_SECRET = "absolute_secret", "Tuyệt mật"


class WorkflowDocumentType(models.TextChoices):
    OFFICIAL_LETTER = "official_letter", "Công văn"
    REPORT = "report", "Báo cáo"
    PROPOSAL = "proposal", "Tờ trình"
    REQUEST_FOR_OPINION = "request_for_opinion", "Văn bản xin ý kiến"
    SUBMISSION_NOTE = "submission_note", "Phiếu trình"
    MEETING_CONCLUSION = "meeting_conclusion", "Thông báo kết luận"
    DECISION = "decision", "Quyết định"
    PLAN = "plan", "Kế hoạch"
    INVITATION = "invitation", "Giấy mời"
    OTHER = "other", "Khác"


class WorkflowStatus(models.TextChoices):
    NEW = "new", "Mới"
    IN_PROGRESS = "in_progress", "Đang xử lý"
    PENDING_COLLABORATION = "pending_collaboration", "Chờ phối hợp"
    PENDING_APPROVAL = "pending_approval", "Chờ phê duyệt"
    OVERDUE = "overdue", "Quá hạn"
    COMPLETED = "completed", "Hoàn tất"
    ARCHIVED = "archived", "Lưu trữ"


class WorkflowStage(models.TextChoices):
    INTAKE = "intake", "Tiếp nhận"
    REGISTRATION = "registration", "Đăng ký"
    DISTRIBUTION = "distribution", "Phân phối"
    REVIEW = "review", "Xử lý"
    CONSULTATION = "consultation", "Phối hợp"
    APPROVAL = "approval", "Phê duyệt"
    RESPONSE = "response", "Phản hồi"
    CLOSED = "closed", "Đóng"


class WorkflowUrgencyLevel(models.TextChoices):
    NORMAL = "normal", "Bình thường"
    URGENT = "urgent", "Khẩn"
    VERY_URGENT = "very_urgent", "Thượng khẩn"
    IMMEDIATE = "immediate", "Hỏa tốc"


class WorkflowIntakeChannel(models.TextChoices):
    PAPER_SCAN = "paper_scan", "Bản giấy số hóa"
    EMAIL = "email", "Email"
    PORTAL = "portal", "Cổng điện tử"
    INTERNAL_TRANSFER = "internal_transfer", "Chuyển nội bộ"
    DIRECT_UPLOAD = "direct_upload", "Tải lên trực tiếp"
    API = "api", "Tích hợp hệ thống"


class LibraryDocumentType(models.TextChoices):
    LEGAL_DOCUMENT = "legal_document", "Văn bản pháp luật"
    DECISION = "decision", "Quyết định"
    CIRCULAR = "circular", "Thông tư"
    DIRECTIVE = "directive", "Chỉ thị"
    NOTICE = "notice", "Thông báo"
    GUIDELINE = "guideline", "Hướng dẫn"
    PROCEDURE = "procedure", "Quy trình"
    FORM = "form", "Biểu mẫu"
    TEMPLATE = "template", "Mẫu văn bản"
    REPORT = "report", "Báo cáo"
    PLAN = "plan", "Kế hoạch"
    OTHER = "other", "Khác"


class LibraryDocumentStatus(models.TextChoices):
    DRAFT = "draft", "Dự thảo"
    EFFECTIVE = "effective", "Có hiệu lực"
    SUPERSEDED = "superseded", "Bị thay thế"
    EXPIRED = "expired", "Hết hiệu lực"
    ARCHIVED = "archived", "Lưu trữ"


class LibraryCategory(models.TextChoices):
    LEGAL = "legal", "Pháp lý"
    ADMINISTRATIVE = "administrative", "Hành chính"
    OPERATIONAL = "operational", "Điều hành"
    REPORTING = "reporting", "Báo cáo"
    FORMS_AND_TEMPLATES = "forms_and_templates", "Biểu mẫu và mẫu văn bản"
    PROCEDURES = "procedures", "Thủ tục"
    OTHER = "other", "Khác"


class LibraryRelationType(models.TextChoices):
    RELATED = "related", "Liên quan"
    REFERENCES = "references", "Dẫn chiếu"
    AMENDS = "amends", "Sửa đổi"
    REPLACES = "replaces", "Thay thế"
    IMPLEMENTS = "implements", "Hướng dẫn thi hành"


class AIProcessingStatus(models.TextChoices):
    PENDING = "pending", "Chờ xử lý"
    PROCESSING = "processing", "Đang xử lý"
    COMPLETED = "completed", "Hoàn tất"
    FAILED = "failed", "Thất bại"


class AIReviewStatus(models.TextChoices):
    PENDING = "pending", "Chờ rà soát"
    REVIEWED = "reviewed", "Đã rà soát"
    APPROVED = "approved", "Đã phê duyệt"
    REJECTED = "rejected", "Đã từ chối"
    NEEDS_EDIT = "needs_edit", "Cần chỉnh sửa"
