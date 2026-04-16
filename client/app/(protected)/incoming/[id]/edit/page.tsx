"use client";
import { useState } from "react";
import { ArrowLeft, Sparkles, Check, RotateCcw, Upload, X } from "lucide-react";
import { documents, departments } from "@/data/mock-data";
import type { DocumentStatus, Confidentiality } from "@/data/mock-data";
import { useParams, useRouter } from "next/navigation";
import { $api } from "@/lib/api/api";

const docTypes = [
  "Công văn",
  "Báo cáo",
  "Phiếu trình",
  "Thông báo",
  "Văn bản",
  "Quyết định",
];
const statuses: DocumentStatus[] = [
  "Mới",
  "Đang xử lý",
  "Chờ phối hợp",
  "Chờ phê duyệt",
  "Hoàn tất",
];
const confidentialityLevels: Confidentiality[] = [
  "Thường",
  "Mật",
  "Tối mật",
  "Tuyệt mật",
];

export default function WorkflowEdit() {
  const { id } = useParams();
  const router = useRouter();
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
  const navigate = (path: string) => router.push(path);
  // const doc = documents.find((d) => d.id === id);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [fileName, setFileName] = useState(doc ? `${doc.code}.pdf` : "");

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center h-96">
          <RotateCcw className="h-6 w-6 text-muted-foreground animate-spin" />
          <span className="text-sm text-muted-foreground ml-2">
            Đang tải...
          </span>
        </div>
      </>
    );
  }

  // if (!doc) {
  //   return (
  //     <>
  //       <div className="flex items-center justify-center h-96">
  //         <p className="text-sm text-muted-foreground">Không tìm thấy hồ sơ.</p>
  //       </div>
  //     </>
  //   );
  // }

  // const aiSuggestions = {
  //   summary: doc.summary,
  //   type: doc.type,
  //   subject: doc.subject,
  //   entities: doc.entities.join(", "),
  //   deadline: doc.deadline,
  //   suggestedDept: doc.suggestedDept,
  //   riskFlags: doc.riskFlags.join("; ") || "Không phát hiện",
  // };

  return (
    <>
      <div className="p-4 sm:p-6 animate-fade-in">
        <div className="max-w-[900px] mx-auto">
          <button
            onClick={() => navigate(`/incoming/${id}`)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại chi tiết
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Chỉnh sửa hồ sơ
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {doc?.code} – {doc?.title}
              </p>
            </div>
            <button
              onClick={() => setShowAiSuggestions(!showAiSuggestions)}
              className={`h-9 px-4 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                showAiSuggestions
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "border border-border/60 bg-card text-foreground hover:bg-muted"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              {showAiSuggestions ? "Ẩn gợi ý AI" : "AI phân tích lại"}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-5">
            {/* Form */}
            <div className="flex-1 space-y-5">
              <div className="bg-card rounded-xl border border-border/40 p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <EditField label="Tiêu đề" defaultValue={doc?.title} />
                  <EditField label="Mã số" defaultValue={doc?.code} />
                  <EditField label="Đơn vị gửi" defaultValue={doc?.sender} />
                  <EditSelect
                    label="Phòng ban"
                    options={departments}
                    defaultValue={doc?.department}
                  />
                  <EditSelect
                    label="Loại văn bản"
                    options={docTypes}
                    defaultValue={doc?.type}
                  />
                  <EditSelect
                    label="Bảo mật"
                    options={confidentialityLevels}
                    defaultValue={doc?.confidentiality}
                  />
                  <EditSelect
                    label="Trạng thái"
                    options={statuses}
                    defaultValue={doc?.status}
                  />
                  <EditField
                    label="Hạn xử lý"
                    type="date"
                    defaultValue={doc?.deadline}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">
                    Tóm tắt
                  </label>
                  <textarea
                    defaultValue={doc?.summary}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-border/60 bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition resize-none"
                  />
                </div>
              </div>

              {/* File */}
              <div className="bg-card rounded-xl border border-border/40 p-4 sm:p-6">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">
                  Tệp đính kèm
                </label>
                {fileName ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm">
                    <span className="flex-1 truncate">{fileName}</span>
                    <span className="text-xs text-muted-foreground">
                      2.4 MB
                    </span>
                    <label className="text-xs text-primary hover:underline cursor-pointer">
                      Thay
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          setFileName(e.target.files[0].name)
                        }
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border/60 rounded-xl cursor-pointer hover:border-primary/30 transition-colors">
                    <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">
                      Chọn tệp
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        setFileName(e.target.files[0].name)
                      }
                    />
                  </label>
                )}
              </div>

              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => navigate(`/incoming/${id}`)}
                  className="h-10 px-5 rounded-xl border border-border/60 bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => navigate(`/incoming/${id}`)}
                  className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>

            {/* AI Suggestions Panel */}
            {showAiSuggestions && (
              <div className="w-full lg:w-[320px] flex-shrink-0">
                <div className="bg-card rounded-xl border border-primary/20 p-4 sm:p-5 sticky top-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">
                      Gợi ý AI
                    </h3>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-4">
                    Kết quả phân tích từ tệp đính kèm. Nhấn ✓ để áp dụng.
                  </p>
                  <div className="space-y-3">
                    {/* {Object.entries(aiSuggestions).map(([key, value]) => (
                      <AiSuggestionRow
                        key={key}
                        label={aiFieldLabels[key] || key}
                        value={value}
                      /> */}
                    {/* ))} */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const aiFieldLabels: Record<string, string> = {
  summary: "Tóm tắt",
  type: "Loại văn bản",
  subject: "Chủ đề",
  entities: "Thực thể chính",
  deadline: "Hạn xử lý",
  suggestedDept: "Phòng ban đề xuất",
  riskFlags: "Rủi ro",
};

function AiSuggestionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
          {label}
        </span>
        <button className="h-5 w-5 rounded flex items-center justify-center text-primary hover:bg-primary/10 transition-colors">
          <Check className="h-3 w-3" />
        </button>
      </div>
      <p className="text-xs text-foreground leading-relaxed">{value}</p>
    </div>
  );
}

function EditField({
  label,
  defaultValue,
  placeholder,
  type = "text",
}: {
  label: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground mb-1.5 block">
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition"
      />
    </div>
  );
}

function EditSelect({
  label,
  options,
  defaultValue,
}: {
  label: string;
  options: string[];
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground mb-1.5 block">
        {label}
      </label>
      <select
        defaultValue={defaultValue}
        className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
