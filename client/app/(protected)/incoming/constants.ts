import { Confidentiality } from "@/data/mock-data";

export type DocumentStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "PENDING_COORDINATION"
  | "PENDING_APPROVAL"
  | "OVERDUE"
  | "COMPLETED";

export const DOCUMENT_CONFIDENTIALITY_LABEL: Record<Confidentiality, string> = {
  UNCLASSIFIED: "Không phân loại",
  CONFIDENTIAL: "Mật",
  SECRET: "Tối mật",
  TOP_SECRET: "Tuyệt mật",
};

export const DOCUMENT_STATUS_LABEL: Record<DocumentStatus, string> = {
  NEW: "Mới",
  IN_PROGRESS: "Đang xử lý",
  PENDING_COORDINATION: "Chờ phối hợp",
  PENDING_APPROVAL: "Chờ phê duyệt",
  OVERDUE: "Quá hạn",
  COMPLETED: "Hoàn tất",
};

export type DocumentType =
  | "OFFICIAL_LETTER"
  | "REPORT"
  | "DECISION"
  | "DOCUMENT"
  | "FORM"
  | "ANNOUNCEMENT"
  | "OTHER";

export const DOCUMENT_TYPE_LABEL: Record<DocumentType, string> = {
  OFFICIAL_LETTER: "Công văn",
  REPORT: "Báo cáo",
  DECISION: "Quyết định",
  DOCUMENT: "Văn bản",
  FORM: "Biểu mẫu",
  ANNOUNCEMENT: "Thông báo",
  OTHER: "Khác",
};
