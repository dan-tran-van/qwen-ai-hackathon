"use client";
import { documents, workflowSteps as defaultSteps } from "@/data/mock-data";
import { StatusBadge } from "@/components/custom/status-badge";
import {
  Check,
  Clock,
  AlertTriangle,
  User,
  Building2,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { $api } from "@/lib/api/api";

// Per-document workflow data
const docWorkflows: Record<string, typeof defaultSteps> = {
  "1": [
    {
      stage: "Tiếp nhận",
      department: "Văn thư",
      assignee: "Nguyễn Thị Mai",
      status: "completed",
      date: "2026-04-08 08:00",
      note: "Đã scan và số hóa",
    },
    {
      stage: "Phân loại & Đăng ký",
      department: "Văn thư",
      assignee: "AI Engine",
      status: "completed",
      date: "2026-04-08 08:02",
      note: "Tự động phân loại: Công văn (94%)",
    },
    {
      stage: "Phân phối",
      department: "Phòng QLHC",
      assignee: "Nguyễn Văn An",
      status: "current",
      date: "2026-04-08 09:30",
    },
    {
      stage: "Xử lý chuyên môn",
      department: "Phòng QLHC",
      assignee: "Nguyễn Văn An",
      status: "pending",
    },
    {
      stage: "Phê duyệt",
      department: "Ban Giám đốc",
      assignee: "—",
      status: "pending",
    },
    {
      stage: "Phát hành phản hồi",
      department: "Văn thư",
      assignee: "—",
      status: "pending",
    },
  ],
  "2": [
    {
      stage: "Tiếp nhận",
      department: "Văn thư",
      assignee: "Nguyễn Thị Mai",
      status: "completed",
      date: "2026-04-07 07:45",
      note: "Nhận từ UBND Quận 3",
    },
    {
      stage: "Phân loại & Đăng ký",
      department: "Văn thư",
      assignee: "AI Engine",
      status: "completed",
      date: "2026-04-07 07:47",
      note: "Tự động: Báo cáo (88%)",
    },
    {
      stage: "Phân phối",
      department: "Phòng KHTC",
      assignee: "Trần Thị Bình",
      status: "completed",
      date: "2026-04-07 08:30",
    },
    {
      stage: "Xử lý chuyên môn",
      department: "Phòng KHTC",
      assignee: "Trần Thị Bình",
      status: "current",
      date: "2026-04-07 10:00",
      note: "Yêu cầu bổ sung số liệu Q1",
    },
    {
      stage: "Phê duyệt",
      department: "Ban Giám đốc",
      assignee: "—",
      status: "pending",
    },
    {
      stage: "Phát hành phản hồi",
      department: "Văn thư",
      assignee: "—",
      status: "pending",
    },
  ],
  "4": [
    {
      stage: "Tiếp nhận",
      department: "Văn thư",
      assignee: "Nguyễn Thị Mai",
      status: "completed",
      date: "2026-04-05 08:00",
    },
    {
      stage: "Phân loại & Đăng ký",
      department: "Văn thư",
      assignee: "AI Engine",
      status: "completed",
      date: "2026-04-05 08:02",
    },
    {
      stage: "Phân phối",
      department: "Ban Giám đốc",
      assignee: "Phạm Minh Đức",
      status: "completed",
      date: "2026-04-05 09:00",
    },
    {
      stage: "Xử lý chuyên môn",
      department: "Ban Giám đốc",
      assignee: "Phạm Minh Đức",
      status: "completed",
      date: "2026-04-06 14:00",
      note: "Đã xem xét 3 phương án",
    },
    {
      stage: "Phê duyệt",
      department: "Ban Giám đốc",
      assignee: "Phạm Minh Đức",
      status: "current",
      date: "2026-04-07 10:00",
    },
    {
      stage: "Phát hành phản hồi",
      department: "Văn thư",
      assignee: "—",
      status: "pending",
    },
  ],
  "5": [
    {
      stage: "Tiếp nhận",
      department: "Văn thư",
      assignee: "Nguyễn Thị Mai",
      status: "completed",
      date: "2026-04-04 08:00",
    },
    {
      stage: "Phân loại & Đăng ký",
      department: "Văn thư",
      assignee: "AI Engine",
      status: "completed",
      date: "2026-04-04 08:01",
    },
    {
      stage: "Phân phối",
      department: "Phòng TH",
      assignee: "Võ Thị Hương",
      status: "completed",
      date: "2026-04-04 09:00",
    },
    {
      stage: "Xử lý chuyên môn",
      department: "Phòng TH",
      assignee: "Võ Thị Hương",
      status: "completed",
      date: "2026-04-04 15:00",
    },
    {
      stage: "Phê duyệt",
      department: "Ban Giám đốc",
      assignee: "Phạm Minh Đức",
      status: "completed",
      date: "2026-04-05 09:00",
    },
    {
      stage: "Phát hành phản hồi",
      department: "Văn thư",
      assignee: "Nguyễn Thị Mai",
      status: "completed",
      date: "2026-04-05 10:00",
      note: "Đã phát hành",
    },
  ],
};

export default function WorkflowTracking() {
  const { id } = useParams();
  const router = useRouter();
  const navigate = (url: string) => {
    router.push(url);
  };
  const { data: doc, isLoading } = $api.useQuery(
    "get",
    "/api/documents/{id}/",
    {
      params: {
        path: {
          id: String(id),
        },
      },
    },
    {
      enabled: !!id,
    },
  );

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

  if (isLoading || workflowLoading || !doc) {
    return (
      <div className="p-4 sm:p-6 max-w-[1000px] mx-auto animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3 mb-4" />
        <div className="h-4 bg-muted rounded w-1/4 mb-2" />
        <div className="h-4 bg-muted rounded w-1/5 mb-6" />
        <div className="h-3 bg-muted rounded w-full mb-2" />
        <div className="h-3 bg-muted rounded w-full mb-2" />
        <div className="h-3 bg-muted rounded w-full mb-2" />
        <div className="h-3 bg-muted rounded w-full mb-2" />
      </div>
    );
  }
  console.log(workflowData);
  // const doc = documents.find((d) => d.id === id) || documents[2];
  const steps = workflowData?.results;

  const currentStep = steps.find((s) => s.status === "current");
  const completedCount = steps.filter((s) => s.status === "completed").length;
  const daysLeft = Math.max(
    0,
    Math.round((new Date(doc.deadline).getTime() - Date.now()) / 86400000),
  );

  return (
    <>
      <div className="p-4 sm:p-6 max-w-[1000px] mx-auto animate-fade-in">
        <button
          onClick={() => navigate(`/incoming/${doc.id}`)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại chi tiết
        </button>

        {/* Document header */}
        <div className="bg-card rounded-xl border border-border/40 shadow-card p-4 sm:p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-mono text-muted-foreground">
                  {doc.code}
                </span>
                <StatusBadge status={doc.status} />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">
                {doc.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {doc.sender}
              </p>
            </div>
            <div className="sm:text-right">
              <div
                className={`flex items-center gap-1.5 ${daysLeft <= 3 ? "text-destructive" : "text-warning"}`}
              >
                <Clock className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  {doc.status === "COMPLETED"
                    ? "Đã hoàn tất"
                    : doc.status === "OVERDUE"
                      ? "Quá hạn"
                      : `${daysLeft} ngày còn lại`}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Hạn: {doc.deadline}
              </p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-muted-foreground">
                Tiến trình
              </span>
              <span className="text-[10px] text-muted-foreground">
                {completedCount}/{steps.length} bước
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(completedCount / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card rounded-xl border border-border/40 shadow-card p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-foreground mb-6">
            Tiến trình xử lý – {doc.code}
          </h3>

          <div className="relative">
            {steps.map((step, i) => {
              const isLast = i === steps.length - 1;
              return (
                <div
                  key={i}
                  className="flex gap-3 sm:gap-4 pb-8 last:pb-0 relative"
                >
                  {!isLast && (
                    <div
                      className={`absolute left-[15px] top-8 w-px h-[calc(100%-16px)] ${
                        step.status === "completed"
                          ? "bg-success/30"
                          : "bg-border"
                      }`}
                    />
                  )}
                  <div
                    className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.status === "completed"
                        ? "bg-success/10 text-success border border-success/20"
                        : step.status === "current"
                          ? "bg-primary/10 text-primary border border-primary/20 ring-4 ring-primary/5"
                          : "bg-muted text-muted-foreground border border-border/60"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <Check className="h-4 w-4" />
                    ) : step.status === "current" ? (
                      <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                    ) : (
                      <span className="text-xs font-medium">{i + 1}</span>
                    )}
                  </div>
                  <div
                    className={`flex-1 pt-1 min-w-0 ${step.status === "pending" ? "opacity-50" : ""}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-sm font-semibold text-foreground">
                        {step.stage}
                      </h4>
                      {step.date && (
                        <span className="text-[10px] text-muted-foreground">
                          {step.date}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Building2 className="h-3 w-3" /> {step.department}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" /> {step.assignee}
                      </span>
                    </div>
                    {step.note && (
                      <p className="text-xs text-muted-foreground mt-1.5 p-2 rounded-md bg-muted/50">
                        {step.note}
                      </p>
                    )}
                    {step.status === "current" && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-primary">
                        <AlertTriangle className="h-3 w-3" /> Đang xử lý
                        {currentStep?.stage === "Xử lý chuyên môn" &&
                          " – chờ ý kiến chuyên gia"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
