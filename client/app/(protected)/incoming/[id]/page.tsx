"use client";
import {
  StatusBadge,
  ConfidentialityBadge,
} from "@/components/custom/status-badge";
import { documents, workflowSteps, auditLog } from "@/data/mock-data";
import { useState } from "react";
import {
  Sparkles,
  FileText,
  Calendar,
  Building2,
  User,
  Shield,
  AlertTriangle,
  Check,
  Send,
  Edit3,
  ArrowUpRight,
  MessageSquare,
  Link2,
  Clock,
  Target,
  GitBranch,
  Trash2,
  Bot,
  Eye,
  Users,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Search,
  X,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { $api } from "@/lib/api/api";
import { DOCUMENT_TYPE_LABEL } from "../constants";

// Stage-dependent config
const stageConfig: Record<string, { sections: string[]; actions: string[] }> = {
  Mới: {
    sections: ["ai-review"],
    actions: ["approve", "edit", "forward", "ask-ai", "workflow", "delete"],
  },
  "Đang xử lý": {
    sections: ["ai-review", "assigned-users", "comments"],
    actions: [
      "approve",
      "edit",
      "forward",
      "consult",
      "ask-ai",
      "workflow",
      "delete",
    ],
  },
  "Chờ phối hợp": {
    sections: ["ai-review", "assigned-users", "coordination", "comments"],
    actions: [
      "approve",
      "edit",
      "forward",
      "consult",
      "ask-ai",
      "workflow",
      "delete",
    ],
  },
  "Chờ phê duyệt": {
    sections: ["ai-review", "assigned-users", "comments", "final-response"],
    actions: [
      "approve",
      "reject",
      "edit",
      "generate-response",
      "view-response",
      "ask-ai",
      "workflow",
      "delete",
    ],
  },
  "Quá hạn": {
    sections: ["ai-review", "assigned-users", "comments", "overdue"],
    actions: [
      "approve",
      "edit",
      "forward",
      "reopen",
      "ask-ai",
      "workflow",
      "delete",
    ],
  },
  "Hoàn tất": {
    sections: ["ai-review", "final-response", "comments"],
    actions: ["reopen", "edit", "ask-ai", "workflow", "delete"],
  },
};

const mockAssignedUsers = [
  { name: "Nguyễn Văn An", role: "Người xử lý chính", dept: "Phòng QLHC" },
  { name: "Trần Thị Bình", role: "Phối hợp", dept: "Phòng KHTC" },
];

const mockComments = [
  {
    user: "Trần Thị Bình",
    time: "2026-04-08 14:30",
    text: "Đã xem xét hồ sơ, cần bổ sung số liệu Q1/2026.",
  },
  {
    user: "Lê Hoàng Phúc",
    time: "2026-04-07 09:15",
    text: "Chuyển phòng TN-MT xử lý theo quy trình.",
  },
];

const mockCoordination = [
  {
    dept: "Sở Tài nguyên và Môi trường",
    status: "Đã phản hồi",
    date: "2026-04-09",
  },
  { dept: "Sở Kế hoạch và Đầu tư", status: "Chờ phản hồi", date: "—" },
];

export default function DocumentDetail() {
  const { id } = useParams();
  const router = useRouter();
  const navigate = (url: string) => router.push(url);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showConsultDialog, setShowConsultDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showReopenDialog, setShowReopenDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showResponsePreview, setShowResponsePreview] = useState(false);
  const [generatingResponse, setGeneratingResponse] = useState(false);

  const {
    data: doc,
    isLoading,
    error,
  } = $api.useQuery("get", "/api/documents/{id}/", {
    params: {
      path: {
        id: String(id),
      },
    },
  });
  const { data: workflowData, isLoading: workflowLoading } = $api.useQuery(
    "get",
    "/api/workflows/document/{document_id}/workflow-steps/",
    {
      params: {
        path: {
          document_id: String(id),
        },
      },
    },
    {
      enabled: !!id,
    },
  );

  if (isLoading || workflowLoading) {
    return <div>Loading...</div>;
  }

  if (!doc) {
    return <div>Không tìm thấy văn bản</div>;
  }

  const relatedAudit = auditLog
    .filter((a) => a.document === doc.code)
    .slice(0, 3);

  const config = stageConfig[doc?.status] || stageConfig["Mới"];

  const handleAskAI = () => {
    if (!doc) return;
    navigate(`/ai-chat?source=workflow&docId=${doc.id}`);
  };

  const handleGenerateResponse = () => {
    setGeneratingResponse(true);
    setTimeout(() => {
      setGeneratingResponse(false);
      setShowResponsePreview(true);
    }, 2000);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-56px)] animate-fade-in">
        {/* Left: Document Preview */}
        <div className="w-full lg:w-[420px] border-b lg:border-b-0 lg:border-r border-border/40 flex flex-col bg-card/30">
          <div className="p-4 sm:p-5 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Xem trước văn bản
                </h3>
                <p className="text-xs text-muted-foreground">{doc.title}</p>
              </div>
              <button
                onClick={() => navigate("/incoming")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" /> Danh sách
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 sm:p-5 overflow-auto">
            <div
              onClick={() => setShowPreview(true)}
              className="bg-card rounded-xl border border-border/40 p-4 sm:p-6 shadow-card min-h-[300px] lg:min-h-[400px] cursor-pointer hover:shadow-md transition-shadow relative group"
            >
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 rounded-xl transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium text-foreground bg-card/90 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                  <Eye className="h-3 w-3" /> Xem chi tiết
                </span>
              </div>
              <div className="text-center mb-6">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                  Cộng hòa xã hội chủ nghĩa Việt Nam
                </p>
                <p className="text-[10px] font-medium text-muted-foreground">
                  Độc lập – Tự do – Hạnh phúc
                </p>
                <div className="h-px w-16 mx-auto bg-border mt-2" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                Số: {doc.code}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Ngày: {doc.received_date}
              </p>
              <h4 className="text-sm font-semibold text-foreground text-center mb-4">
                {doc?.title?.toUpperCase()}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {doc?.summary}
              </p>
              <div className="mt-8 text-right">
                <p className="text-xs text-muted-foreground font-medium">
                  {doc.sender}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Thông tin
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-3 w-3" /> Loại: {doc.type}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3 w-3" /> Hạn: {doc.deadline}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-3 w-3" /> {doc.sender}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="h-3 w-3" />{" "}
                  <ConfidentialityBadge level={doc.confidentiality} />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                Tệp đính kèm
              </h4>
              <div
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-xs text-muted-foreground cursor-pointer hover:bg-muted transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>{doc.code}.pdf</span>
                <span className="ml-auto text-[10px]">2.4 MB</span>
                <Eye className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Workspace */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-5">
            {/* AI Summary Card */}
            {config.sections.includes("ai-review") && (
              <div className="bg-card rounded-xl border border-border/40 shadow-card p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">
                      AI Review
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">
                      Confidence
                    </span>
                    <span className="text-xs font-semibold text-primary">
                      {Math.round((doc?.ai_confidence || 0) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <MetaField label="Tiêu đề trích xuất" value={doc.title} />
                  <MetaField label="Chủ đề" value={doc.subject} />
                  <MetaField
                    label="Loại văn bản"
                    value={
                      doc?.document_type
                        ? DOCUMENT_TYPE_LABEL[doc.document_type]
                        : ""
                    }
                  />
                  <MetaField
                    label="Hạn xử lý"
                    value={doc?.deadline}
                    icon={<Clock className="h-3 w-3 text-warning" />}
                  />
                  <MetaField
                    label="Phòng ban đề xuất"
                    value={doc?.suggested_dept}
                    icon={<Target className="h-3 w-3 text-primary" />}
                  />
                  <MetaField
                    label="Người xử lý đề xuất"
                    value={doc?.suggested_reviewer}
                    icon={<User className="h-3 w-3 text-primary" />}
                  />
                </div>
                <div className="mt-4">
                  <label className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                    Tóm tắt AI
                  </label>
                  <p className="text-sm text-foreground mt-1 leading-relaxed">
                    {doc.summary}
                  </p>
                </div>
                <div className="mt-4">
                  <label className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                    Thực thể chính
                  </label>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {doc?.entities && doc?.entities?.length > 0
                      ? doc?.entities?.map((e) => (
                          <span
                            key={e}
                            className="px-2 py-0.5 rounded-md bg-accent text-xs text-accent-foreground"
                          >
                            {e}
                          </span>
                        ))
                      : null}
                  </div>
                </div>
                {doc?.risk_flags && doc?.risk_flags?.length > 0 && (
                  <div className="mt-4 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                    <div className="flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                      <span className="text-xs font-medium text-destructive">
                        Cảnh báo rủi ro
                      </span>
                    </div>
                    {doc?.risk_flags &&
                      doc.risk_flags.map((f) => (
                        <p key={f} className="text-xs text-muted-foreground">
                          • {f}
                        </p>
                      ))}
                  </div>
                )}
                {doc?.related_docs && doc?.related_docs?.length > 0 && (
                  <div className="mt-4">
                    <label className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                      Văn bản liên quan
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {doc?.related_docs?.map((r) => (
                        <span
                          key={r}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                        >
                          <Link2 className="h-3 w-3" /> {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Assigned Users */}
            {config.sections.includes("assigned-users") && (
              <div className="bg-card rounded-xl border border-border/40 shadow-card p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Người xử lý
                </h3>
                <div className="space-y-2">
                  {mockAssignedUsers.map((u) => (
                    <div
                      key={u.name}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {u.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {u.role} · {u.dept}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coordination */}
            {config.sections.includes("coordination") && (
              <div className="bg-card rounded-xl border border-border/40 shadow-card p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Phối hợp liên sở
                </h3>
                <div className="space-y-2">
                  {mockCoordination.map((c) => (
                    <div
                      key={c.dept}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30"
                    >
                      <div>
                        <p className="text-sm text-foreground">{c.dept}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {c.date}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md ${
                          c.status === "Đã phản hồi"
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overdue warning */}
            {config.sections.includes("overdue") && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <h3 className="text-sm font-semibold text-destructive">
                    Quá hạn xử lý
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Hồ sơ này đã quá hạn xử lý. Vui lòng liên hệ phòng ban phụ
                  trách để xử lý khẩn.
                </p>
              </div>
            )}

            {/* Final response */}
            {config.sections.includes("final-response") && (
              <div className="bg-card rounded-xl border border-border/40 shadow-card p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Phản hồi chính thức
                </h3>
                {doc?.status === "COMPLETED" ? (
                  <div className="p-3 rounded-lg bg-success/5 border border-success/20 text-sm text-foreground">
                    Văn bản phản hồi đã được phê duyệt và phát hành. Mã phản
                    hồi: PH-{doc.code}.
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Chưa có phản hồi chính thức. Sử dụng AI để tạo bản nháp.
                  </p>
                )}
              </div>
            )}

            {/* Comments */}
            {config.sections.includes("comments") && (
              <div className="bg-card rounded-xl border border-border/40 shadow-card p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Ghi chú & Nhận xét
                </h3>
                <div className="space-y-3">
                  {mockComments.map((c, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-foreground">
                          {c.user}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {c.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {config.actions.includes("approve") && (
                <button
                  onClick={() => setShowApproveDialog(true)}
                  className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition"
                >
                  <Check className="h-3.5 w-3.5" /> Phê duyệt
                </button>
              )}
              {config.actions.includes("reject") && (
                <button
                  onClick={() => setShowRejectDialog(true)}
                  className="h-9 px-4 rounded-lg border border-warning/40 text-sm font-medium text-warning flex items-center gap-2 hover:bg-warning/5 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Trả lại
                </button>
              )}
              {config.actions.includes("edit") && (
                <button
                  onClick={() => navigate(`/incoming/${doc.id}/edit`)}
                  className="h-9 px-4 rounded-lg border border-border/60 bg-card text-sm font-medium text-foreground flex items-center gap-2 hover:bg-muted transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Chỉnh sửa
                </button>
              )}
              {config.actions.includes("forward") && (
                <button
                  onClick={() => setShowForwardDialog(true)}
                  className="h-9 px-4 rounded-lg border border-border/60 bg-card text-sm font-medium text-foreground flex items-center gap-2 hover:bg-muted transition-colors"
                >
                  <Send className="h-3.5 w-3.5" /> Chuyển tiếp
                </button>
              )}
              {config.actions.includes("consult") && (
                <button
                  onClick={() => setShowConsultDialog(true)}
                  className="h-9 px-4 rounded-lg border border-border/60 bg-card text-sm font-medium text-foreground flex items-center gap-2 hover:bg-muted transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Xin ý kiến
                </button>
              )}
              {config.actions.includes("generate-response") && (
                <button
                  onClick={handleGenerateResponse}
                  disabled={generatingResponse}
                  className="h-9 px-4 rounded-lg border border-primary/30 bg-primary/5 text-sm font-medium text-primary flex items-center gap-2 hover:bg-primary/10 transition-colors disabled:opacity-60"
                >
                  {generatingResponse ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  {generatingResponse ? "Đang tạo..." : "Tạo phản hồi AI"}
                </button>
              )}
              {config.actions.includes("view-response") && (
                <button
                  onClick={() => setShowResponsePreview(true)}
                  className="h-9 px-4 rounded-lg border border-border/60 bg-card text-sm font-medium text-foreground flex items-center gap-2 hover:bg-muted transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" /> Xem phản hồi
                </button>
              )}
              {config.actions.includes("ask-ai") && (
                <button
                  onClick={handleAskAI}
                  className="h-9 px-4 rounded-lg border border-border/60 bg-card text-sm font-medium text-foreground flex items-center gap-2 hover:bg-muted transition-colors"
                >
                  <Bot className="h-3.5 w-3.5" /> Hỏi AI
                </button>
              )}
              {config.actions.includes("workflow") && (
                <button
                  onClick={() => navigate(`/incoming/${doc.id}/workflow`)}
                  className="h-9 px-4 rounded-lg border border-border/60 bg-card text-sm font-medium text-foreground flex items-center gap-2 hover:bg-muted transition-colors"
                >
                  <GitBranch className="h-3.5 w-3.5" /> Theo dõi quy trình
                </button>
              )}
              {config.actions.includes("reopen") && (
                <button
                  onClick={() => setShowReopenDialog(true)}
                  className="h-9 px-4 rounded-lg border border-border/60 bg-card text-sm font-medium text-foreground flex items-center gap-2 hover:bg-muted transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Mở lại
                </button>
              )}
              {config.actions.includes("delete") && (
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="h-9 px-4 rounded-lg border border-destructive/30 text-sm font-medium text-destructive flex items-center gap-2 hover:bg-destructive/5 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Xóa
                </button>
              )}
            </div>

            {/* Status & Audit */}
            <div className="bg-card rounded-xl border border-border/40 shadow-card p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Trạng thái & Lịch sử
                </h3>
                <StatusBadge status={doc.status} />
              </div>
              <div className="space-y-3 mb-5">
                {workflowData?.results.slice(0, 4).map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-medium ${
                        step.status === "completed"
                          ? "bg-success/10 text-success"
                          : step.status === "current"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.status === "completed" ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">
                        {step.stage}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {step.assignee} · {step.department}
                      </p>
                      {step.date && (
                        <p className="text-[10px] text-muted-foreground">
                          {step.date}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                Nhật ký
              </h4>
              <div className="space-y-2">
                {relatedAudit.map((a) => (
                  <div key={a.id} className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {a.user}
                    </span>{" "}
                    · {a.action} · {a.timestamp}
                    <p className="text-[10px] mt-0.5">{a.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Xóa hồ sơ"
        description={
          <>
            Bạn có chắc chắn muốn xóa hồ sơ <strong>{doc.code}</strong>? Hành
            động này không thể hoàn tác.
          </>
        }
        confirmLabel="Xóa"
        destructive
        onConfirm={() => {
          setShowDeleteDialog(false);
          navigate("/incoming");
        }}
        onCancel={() => setShowDeleteDialog(false)}
      />

      {/* Approve dialog */}
      <ConfirmDialog
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
        title="Phê duyệt hồ sơ"
        description={
          <>
            Xác nhận phê duyệt hồ sơ <strong>{doc.code}</strong>?
          </>
        }
        confirmLabel="Phê duyệt"
        onConfirm={() => {
          setShowApproveDialog(false);
          toast("Đã phê duyệt", {
            description: `Hồ sơ ${doc.code} đã được phê duyệt thành công.`,
          });
        }}
        onCancel={() => setShowApproveDialog(false)}
      />

      {/* Reject dialog */}
      <ConfirmDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        title="Trả lại hồ sơ"
        description={
          <>
            Trả lại hồ sơ <strong>{doc.code}</strong> để bổ sung hoặc chỉnh sửa?
          </>
        }
        confirmLabel="Trả lại"
        destructive
        onConfirm={() => {
          setShowRejectDialog(false);
          toast("Đã trả lại", {
            description: `Hồ sơ ${doc.code} đã được trả lại.`,
          });
        }}
        onCancel={() => setShowRejectDialog(false)}
      />

      {/* Reopen dialog */}
      <ConfirmDialog
        open={showReopenDialog}
        onOpenChange={setShowReopenDialog}
        title="Mở lại hồ sơ"
        description={
          <>
            Mở lại hồ sơ <strong>{doc.code}</strong> để tiếp tục xử lý?
          </>
        }
        confirmLabel="Mở lại"
        onConfirm={() => {
          setShowReopenDialog(false);
          toast("Đã mở lại", {
            description: `Hồ sơ ${doc.code} đã được mở lại.`,
          });
        }}
        onCancel={() => setShowReopenDialog(false)}
      />

      {/* Forward dialog */}
      <SelectDialog
        open={showForwardDialog}
        onOpenChange={setShowForwardDialog}
        title="Chuyển tiếp hồ sơ"
        description="Chọn phòng ban nhận:"
        options={[
          "Phòng Quản lý Hành chính",
          "Phòng Kế hoạch Tài chính",
          "Phòng Tài nguyên Môi trường",
          "Phòng Tổng hợp",
          "Ban Giám đốc",
        ]}
        confirmLabel="Chuyển tiếp"
        onConfirm={(val) => {
          setShowForwardDialog(false);
          toast("Đã chuyển tiếp", {
            description: `Đã chuyển đến ${val}.`,
          });
        }}
        onCancel={() => setShowForwardDialog(false)}
      />

      {/* Assign dialog */}
      <SelectDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        title="Phân công xử lý"
        description="Chọn người xử lý:"
        options={[
          "Nguyễn Văn An",
          "Trần Thị Bình",
          "Lê Hoàng Phúc",
          "Phạm Minh Đức",
          "Võ Thị Hương",
        ]}
        confirmLabel="Phân công"
        onConfirm={(val) => {
          setShowAssignDialog(false);
          toast("Đã phân công", {
            description: `Đã phân công cho ${val}.`,
          });
        }}
        onCancel={() => setShowAssignDialog(false)}
      />

      {/* Consult dialog */}
      <SelectDialog
        open={showConsultDialog}
        onOpenChange={setShowConsultDialog}
        title="Xin ý kiến"
        description="Chọn đơn vị/người cần xin ý kiến:"
        options={[
          "Sở Kế hoạch và Đầu tư",
          "Sở Tài nguyên và Môi trường",
          "Sở Nội vụ",
          "Văn phòng UBND",
        ]}
        confirmLabel="Gửi yêu cầu"
        onConfirm={(val) => {
          setShowConsultDialog(false);
          toast("Đã gửi yêu cầu", {
            description: `Yêu cầu xin ý kiến đã gửi đến ${val}.`,
          });
        }}
        onCancel={() => setShowConsultDialog(false)}
      />

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        doc={doc}
      />

      {/* Response Preview */}
      <Dialog open={showResponsePreview} onOpenChange={setShowResponsePreview}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Phản hồi AI
            </DialogTitle>
          </DialogHeader>
          <div className="bg-muted/30 rounded-lg p-4 text-sm text-foreground leading-relaxed space-y-3">
            <p>
              <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong>
            </p>
            <p>Kính gửi: {doc.sender}</p>
            <p>
              V/v: Phản hồi {doc.code} – {doc.title}
            </p>
            <p>
              Căn cứ nội dung văn bản {doc.code} ngày {doc.received_date}, sau
              khi xem xét, chúng tôi có ý kiến như sau:
            </p>
            <p>
              1. Nội dung đề nghị đã được tiếp nhận và xử lý theo đúng quy
              trình.
            </p>
            <p>
              2. Đề xuất: Phê duyệt theo phương án do phòng {doc.suggested_dept}{" "}
              trình bày.
            </p>
            <p className="text-right mt-4 font-medium">
              Trưởng phòng
              <br />
              {doc?.suggested_reviewer}
            </p>
          </div>
          <DialogFooter className="gap-2">
            <button
              onClick={() => setShowResponsePreview(false)}
              className="h-9 px-4 rounded-lg border border-border/60 bg-card text-sm font-medium hover:bg-muted transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                setShowResponsePreview(false);
                toast("Đã lưu", {
                  description: "Phản hồi đã được lưu.",
                });
              }}
              className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
            >
              Áp dụng
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function MetaField({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null | undefined;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
        {label}
      </label>
      <p className="text-sm text-foreground mt-0.5 flex items-center gap-1.5">
        {icon}
        {value}
      </p>
    </div>
  );
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  destructive,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <button
            onClick={onCancel}
            className="h-9 px-4 rounded-lg border border-border/60 bg-card text-sm font-medium hover:bg-muted transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className={`h-9 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition ${destructive ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"}`}
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SelectDialog({
  open,
  onOpenChange,
  title,
  description,
  options,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  options: string[];
  confirmLabel: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState(options[0]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5 max-h-[200px] overflow-auto">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelected(opt)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                selected === opt
                  ? "bg-primary/10 border border-primary/20 text-foreground"
                  : "hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <DialogFooter className="gap-2">
          <button
            onClick={onCancel}
            className="h-9 px-4 rounded-lg border border-border/60 bg-card text-sm font-medium hover:bg-muted transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => onConfirm(selected)}
            className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DocumentPreviewModal({
  open,
  onClose,
  doc,
}: {
  open: boolean;
  onClose: () => void;
  doc: (typeof documents)[0];
}) {
  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(1);
  const totalPages = 3;
  // const { toast } = useToast();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col p-0 gap-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 flex-wrap gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-sm font-medium text-foreground truncate">
              {doc.code}.pdf
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 25))}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-xs text-muted-foreground w-12 text-center">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(200, z + 25))}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <div className="w-px h-5 bg-border mx-1" />
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-muted-foreground">
              {page}/{totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="w-px h-5 bg-border mx-1" />
            <button
              onClick={() =>
                toast({
                  title: "Tải xuống",
                  description: `Đã tải ${doc.code}.pdf`,
                })
              }
              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={() =>
                toast({
                  title: "Chia sẻ",
                  description: "Link chia sẻ đã được sao chép.",
                })
              }
              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        {/* Preview area */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-muted/30 flex items-start justify-center">
          <div
            className="bg-card rounded-lg shadow-lg border border-border/40 p-6 sm:p-10 max-w-[700px] w-full"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
            }}
          >
            <div className="text-center mb-8">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                Cộng hòa xã hội chủ nghĩa Việt Nam
              </p>
              <p className="text-[10px] font-medium text-muted-foreground">
                Độc lập – Tự do – Hạnh phúc
              </p>
              <div className="h-px w-20 mx-auto bg-border mt-3" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Số: {doc.code}</p>
            <p className="text-xs text-muted-foreground mb-6">
              Ngày: {doc.receivedDate}
            </p>
            <h4 className="text-sm font-bold text-foreground text-center mb-2">
              {doc.title.toUpperCase()}
            </h4>
            <p className="text-xs text-muted-foreground text-center mb-6">
              V/v: {doc.subject}
            </p>
            <div className="text-xs text-foreground leading-relaxed space-y-3">
              <p>Kính gửi: {doc.suggestedDept}</p>
              <p>{doc.summary}</p>
              <p>
                Căn cứ yêu cầu xử lý, đề nghị phòng ban chức năng xem xét và
                phản hồi trước ngày {doc.deadline}.
              </p>
              {page >= 2 && (
                <p className="text-muted-foreground italic">— Trang {page} —</p>
              )}
              {page >= 2 && (
                <p>
                  Các nội dung bổ sung và phụ lục kèm theo văn bản gốc. Danh
                  sách thực thể liên quan: {doc.entities.join(", ")}.
                </p>
              )}
              {page === 3 && (
                <p>
                  Phụ lục: Danh mục văn bản liên quan:{" "}
                  {doc.relatedDocs.join(", ") || "Không có"}.
                </p>
              )}
            </div>
            <div className="mt-10 text-right">
              <p className="text-xs font-medium text-foreground">
                {doc.sender}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Ký tên, đóng dấu
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
