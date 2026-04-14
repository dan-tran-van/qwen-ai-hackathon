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
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useParams, useRouter } from "next/dist/client/components/navigation";

export default function DocumentDetail() {
  const { id } = useParams();
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const doc = documents.find((d) => d.id === id) || documents[0];
  const relatedAudit = auditLog
    .filter((a) => a.document === doc.code)
    .slice(0, 3);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-56px)] animate-fade-in">
        {/* Left: Document Preview */}
        <div className="w-full lg:w-[420px] border-b lg:border-b-0 lg:border-r border-border/40 flex flex-col bg-card/30">
          <div className="p-4 sm:p-5 border-b border-border/40">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Xem trước văn bản
            </h3>
            <p className="text-xs text-muted-foreground">{doc.title}</p>
          </div>
          <div className="flex-1 p-4 sm:p-5 overflow-auto">
            <div className="bg-card rounded-xl border border-border/40 p-4 sm:p-6 shadow-card min-h-[300px] lg:min-h-[400px]">
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
                Ngày: {doc.receivedDate}
              </p>
              <h4 className="text-sm font-semibold text-foreground text-center mb-4">
                {doc.title.toUpperCase()}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {doc.summary}
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
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  <span>{doc.code}.pdf</span>
                  <span className="ml-auto text-[10px]">2.4 MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Review Workspace */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-5">
            {/* AI Summary Card */}
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
                    {Math.round(doc.aiConfidence * 100)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                    Tiêu đề trích xuất
                  </label>
                  <p className="text-sm text-foreground mt-0.5">{doc.title}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                    Chủ đề
                  </label>
                  <p className="text-sm text-foreground mt-0.5">
                    {doc.subject}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                    Loại văn bản
                  </label>
                  <p className="text-sm text-foreground mt-0.5">{doc.type}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                    Hạn xử lý
                  </label>
                  <p className="text-sm text-foreground mt-0.5 flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-warning" />
                    {doc.deadline}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                    Phòng ban đề xuất
                  </label>
                  <p className="text-sm text-foreground mt-0.5 flex items-center gap-1.5">
                    <Target className="h-3 w-3 text-primary" />
                    {doc.suggestedDept}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                    Người xử lý đề xuất
                  </label>
                  <p className="text-sm text-foreground mt-0.5 flex items-center gap-1.5">
                    <User className="h-3 w-3 text-primary" />
                    {doc.suggestedReviewer}
                  </p>
                </div>
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
                  {doc.entities.map((e) => (
                    <span
                      key={e}
                      className="px-2 py-0.5 rounded-md bg-accent text-xs text-accent-foreground"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>

              {doc.riskFlags.length > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="h-3 w-3 text-destructive" />
                    <span className="text-xs font-medium text-destructive">
                      Cảnh báo rủi ro
                    </span>
                  </div>
                  {doc.riskFlags.map((f) => (
                    <p key={f} className="text-xs text-muted-foreground">
                      • {f}
                    </p>
                  ))}
                </div>
              )}

              {doc.relatedDocs.length > 0 && (
                <div className="mt-4">
                  <label className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                    Văn bản liên quan
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {doc.relatedDocs.map((r) => (
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

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <button className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition">
                <Check className="h-3.5 w-3.5" /> Phê duyệt
              </button>
              <button
                onClick={() => navigate(`/incoming/${doc.id}/edit`)}
                className="h-9 px-4 rounded-lg border border-border/60 bg-card text-sm font-medium text-foreground flex items-center gap-2 hover:bg-muted transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" /> Chỉnh sửa
              </button>
              <button className="h-9 px-4 rounded-lg border border-border/60 bg-card text-sm font-medium text-foreground flex items-center gap-2 hover:bg-muted transition-colors">
                <Send className="h-3.5 w-3.5" /> Chuyển tiếp
              </button>
              <button className="h-9 px-4 rounded-lg border border-border/60 bg-card text-sm font-medium text-foreground flex items-center gap-2 hover:bg-muted transition-colors">
                <MessageSquare className="h-3.5 w-3.5" /> Xin ý kiến
              </button>
              <button
                onClick={() => navigate("/workflow")}
                className="h-9 px-4 rounded-lg border border-border/60 bg-card text-sm font-medium text-foreground flex items-center gap-2 hover:bg-muted transition-colors"
              >
                <GitBranch className="h-3.5 w-3.5" /> Theo dõi quy trình
              </button>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="h-9 px-4 rounded-lg border border-destructive/30 text-sm font-medium text-destructive flex items-center gap-2 hover:bg-destructive/5 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Xóa
              </button>
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
                {workflowSteps.slice(0, 4).map((step, i) => (
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

      {/* Delete confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Xóa hồ sơ</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa hồ sơ <strong>{doc.code}</strong>? Hành
              động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <button
              onClick={() => setShowDeleteDialog(false)}
              className="h-9 px-4 rounded-lg border border-border/60 bg-card text-sm font-medium hover:bg-muted transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                setShowDeleteDialog(false);
                navigate("/incoming");
              }}
              className="h-9 px-4 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition"
            >
              Xóa
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
