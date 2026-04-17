export type DocumentStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "PENDING_COORDINATION"
  | "PENDING_APPROVAL"
  | "OVERDUE"
  | "COMPLETED";
export type Confidentiality =
  | "UNCLASSIFIED"
  | "CONFIDENTIAL"
  | "SECRET"
  | "TOP_SECRET";

export interface GovDocument {
  id: string;
  code: string;
  title: string;
  sender: string;
  receivedDate: string;
  type: string;
  suggestedDept: string;
  suggestedReviewer: string;
  confidentiality: Confidentiality;
  status: DocumentStatus;
  deadline: string;
  summary: string;
  aiConfidence: number;
  riskFlags: string[];
  relatedDocs: string[];
  entities: string[];
  subject: string;
}

export const documents: GovDocument[] = [
  {
    id: "1",
    code: "CV-2026-0142",
    title: "Công văn đề nghị cấp phép hoạt động",
    sender: "Sở Kế hoạch và Đầu tư",
    receivedDate: "2026-04-08",
    type: "Công văn",
    suggestedDept: "Phòng Quản lý Hành chính",
    suggestedReviewer: "Nguyễn Văn An",
    confidentiality: "Thường",
    status: "NEW",
    deadline: "2026-04-18",
    summary:
      "Đề nghị xem xét cấp giấy phép hoạt động cho Công ty TNHH ABC tại khu vực quận 7. Hồ sơ đầy đủ theo quy định tại Nghị định 01/2021/NĐ-CP.",
    aiConfidence: 0.94,
    riskFlags: [],
    relatedDocs: ["CV-2025-0891", "CV-2025-1204"],
    entities: ["Công ty TNHH ABC", "Quận 7", "NĐ 01/2021"],
    subject: "Cấp phép hoạt động doanh nghiệp",
  },
  {
    id: "2",
    code: "HS-2026-1188",
    title: "Báo cáo tình hình triển khai dự án",
    sender: "UBND Quận 3",
    receivedDate: "2026-04-07",
    type: "Báo cáo",
    suggestedDept: "Phòng Kế hoạch Tài chính",
    suggestedReviewer: "Trần Thị Bình",
    confidentiality: "Mật",
    status: "IN_PROGRESS",
    deadline: "2026-04-15",
    summary:
      "Báo cáo tiến độ dự án nâng cấp cơ sở hạ tầng khu dân cư phường 5, quận 3. Tiến độ đạt 67%, dự kiến hoàn thành Q3/2026.",
    aiConfidence: 0.88,
    riskFlags: ["Tiến độ chậm 15%"],
    relatedDocs: ["HS-2025-0934"],
    entities: ["Phường 5", "Quận 3", "Q3/2026"],
    subject: "Tiến độ dự án hạ tầng",
  },
  {
    id: "3",
    code: "UBND-QLHC-2026-52",
    title: "Văn bản xin ý kiến liên sở",
    sender: "Sở Tài nguyên và Môi trường",
    receivedDate: "2026-04-06",
    type: "Văn bản",
    suggestedDept: "Phòng Tài nguyên Môi trường",
    suggestedReviewer: "Lê Hoàng Phúc",
    confidentiality: "Thường",
    status: "PENDING_COORDINATION",
    deadline: "2026-04-20",
    summary:
      "Xin ý kiến góp ý về dự thảo quy hoạch sử dụng đất giai đoạn 2026–2030 của quận 3. Cần phản hồi trước ngày 20/04.",
    aiConfidence: 0.91,
    riskFlags: ["Cần phối hợp đa ngành"],
    relatedDocs: ["UBND-QLHC-2025-48", "QH-2025-0012"],
    entities: ["Quận 3", "Giai đoạn 2026–2030"],
    subject: "Quy hoạch sử dụng đất",
  },
  {
    id: "4",
    code: "TT-2026-0081",
    title: "Phiếu trình xử lý hồ sơ",
    sender: "Văn phòng UBND Thành phố",
    receivedDate: "2026-04-05",
    type: "Phiếu trình",
    suggestedDept: "Ban Giám đốc",
    suggestedReviewer: "Phạm Minh Đức",
    confidentiality: "Tối mật",
    status: "PENDING_APPROVAL",
    deadline: "2026-04-12",
    summary:
      "Trình phê duyệt phương án xử lý khiếu nại của cư dân khu vực tái định cư. Đề xuất 3 phương án giải quyết.",
    aiConfidence: 0.86,
    riskFlags: ["Hạn gấp", "Nhạy cảm xã hội"],
    relatedDocs: ["KN-2026-0023"],
    entities: ["Khu tái định cư", "UBND TP"],
    subject: "Xử lý khiếu nại tái định cư",
  },
  {
    id: "5",
    code: "TB-2026-0205",
    title: "Thông báo kết luận cuộc họp",
    sender: "Văn phòng UBND Thành phố",
    receivedDate: "2026-04-04",
    type: "Thông báo",
    suggestedDept: "Phòng Tổng hợp",
    suggestedReviewer: "Võ Thị Hương",
    confidentiality: "Thường",
    status: "COMPLETED",
    deadline: "2026-04-10",
    summary:
      "Kết luận cuộc họp giao ban tuần ngày 03/04/2026. Các sở ngành triển khai 5 nhiệm vụ trọng tâm tuần tới.",
    aiConfidence: 0.97,
    riskFlags: [],
    relatedDocs: [],
    entities: ["UBND TP", "Giao ban tuần"],
    subject: "Kết luận giao ban",
  },
  {
    id: "6",
    code: "CV-2026-0156",
    title: "Công văn về việc tổ chức hội nghị sơ kết",
    sender: "Sở Nội vụ",
    receivedDate: "2026-04-03",
    type: "Công văn",
    suggestedDept: "Phòng Tổ chức Cán bộ",
    suggestedReviewer: "Nguyễn Văn An",
    confidentiality: "Thường",
    status: "OVERDUE",
    deadline: "2026-04-08",
    summary:
      "Đề nghị phối hợp tổ chức hội nghị sơ kết công tác cải cách hành chính 6 tháng đầu năm 2026.",
    aiConfidence: 0.92,
    riskFlags: ["Quá hạn xử lý"],
    relatedDocs: ["CV-2026-0098"],
    entities: ["Sở Nội vụ", "CCHC"],
    subject: "Hội nghị sơ kết CCHC",
  },
];

export interface WorkflowStep {
  stage: string;
  department: string;
  assignee: string;
  status: "completed" | "current" | "pending";
  date?: string;
  note?: string;
}

export const workflowSteps: WorkflowStep[] = [
  {
    stage: "Tiếp nhận",
    department: "Văn thư",
    assignee: "Nguyễn Thị Mai",
    status: "completed",
    date: "2026-04-06 08:30",
    note: "Đã scan và số hóa",
  },
  {
    stage: "Phân loại & Đăng ký",
    department: "Văn thư",
    assignee: "AI Engine",
    status: "completed",
    date: "2026-04-06 08:32",
    note: "Tự động phân loại: Công văn",
  },
  {
    stage: "Phân phối",
    department: "Phòng QLHC",
    assignee: "Lê Hoàng Phúc",
    status: "completed",
    date: "2026-04-06 09:15",
    note: "Chuyển Phòng TN-MT",
  },
  {
    stage: "Xử lý chuyên môn",
    department: "Phòng TN-MT",
    assignee: "Trần Văn Khoa",
    status: "current",
    date: "2026-04-07 10:00",
  },
  {
    stage: "Tham vấn",
    department: "Liên sở",
    assignee: "—",
    status: "pending",
  },
  {
    stage: "Phê duyệt",
    department: "Ban Giám đốc",
    assignee: "Phạm Minh Đức",
    status: "pending",
  },
  {
    stage: "Phát hành phản hồi",
    department: "Văn thư",
    assignee: "—",
    status: "pending",
  },
];

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  document: string;
  department: string;
  detail: string;
}

export const auditLog: AuditEntry[] = [
  {
    id: "a1",
    timestamp: "2026-04-08 14:22",
    user: "Nguyễn Văn An",
    action: "Phê duyệt",
    document: "CV-2026-0142",
    department: "Phòng QLHC",
    detail: "Phê duyệt hồ sơ cấp phép",
  },
  {
    id: "a2",
    timestamp: "2026-04-08 11:05",
    user: "AI Engine",
    action: "Phân loại",
    document: "HS-2026-1188",
    department: "Hệ thống",
    detail: "Phân loại tự động: Báo cáo (88%)",
  },
  {
    id: "a3",
    timestamp: "2026-04-07 16:30",
    user: "Trần Thị Bình",
    action: "Ghi chú",
    document: "HS-2026-1188",
    department: "Phòng KHTC",
    detail: "Yêu cầu bổ sung số liệu Q1",
  },
  {
    id: "a4",
    timestamp: "2026-04-07 09:45",
    user: "Lê Hoàng Phúc",
    action: "Chuyển tiếp",
    document: "UBND-QLHC-2026-52",
    department: "Phòng TN-MT",
    detail: "Chuyển xin ý kiến liên sở",
  },
  {
    id: "a5",
    timestamp: "2026-04-06 15:00",
    user: "Phạm Minh Đức",
    action: "Xem xét",
    document: "TT-2026-0081",
    department: "Ban GĐ",
    detail: "Đang xem xét phương án xử lý",
  },
  {
    id: "a6",
    timestamp: "2026-04-06 08:32",
    user: "AI Engine",
    action: "Trích xuất",
    document: "CV-2026-0142",
    department: "Hệ thống",
    detail: "Trích xuất metadata tự động",
  },
  {
    id: "a7",
    timestamp: "2026-04-05 10:15",
    user: "Võ Thị Hương",
    action: "Hoàn tất",
    document: "TB-2026-0205",
    department: "Phòng TH",
    detail: "Đóng hồ sơ thông báo",
  },
];

export const departments = [
  "Phòng Quản lý Hành chính",
  "Phòng Kế hoạch Tài chính",
  "Phòng Tài nguyên Môi trường",
  "Phòng Tổng hợp",
  "Phòng Tổ chức Cán bộ",
  "Ban Giám đốc",
  "Văn thư",
];

export const statusColors: Record<DocumentStatus, string> = {
  NEW: "bg-info/10 text-info",
  IN_PROGRESS: "bg-primary/10 text-primary",
  PENDING_COORDINATION: "bg-warning/10 text-warning",
  PENDING_APPROVAL: "bg-accent text-accent-foreground",
  OVERDUE: "bg-destructive/10 text-destructive",
  COMPLETED: "bg-success/10 text-success",
};

export const confidentialityColors: Record<Confidentiality, string> = {
  Thường: "bg-muted text-muted-foreground",
  Mật: "bg-warning/10 text-warning",
  "Tối mật": "bg-destructive/10 text-destructive",
  "Tuyệt mật": "bg-destructive/20 text-destructive",
};
