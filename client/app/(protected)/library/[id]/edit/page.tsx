"use client";
import { useState } from "react";
import { ArrowLeft, Sparkles, Check, Upload, X } from "lucide-react";
import {
  libraryDocuments,
  libraryDocTypes,
  issuingAgencies,
} from "@/data/library-data";
import type { Confidentiality } from "@/data/mock-data";
import { useParams, useRouter } from "next/navigation";

const confidentialityLevels: Confidentiality[] = [
  "Thường",
  "Mật",
  "Tối mật",
  "Tuyệt mật",
];

export default function LibraryEdit() {
  const { id } = useParams();
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const doc = libraryDocuments.find((d) => d.id === id);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [tags, setTags] = useState<string[]>(doc?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [fileName, setFileName] = useState(doc ? `${doc.code}.pdf` : "");

  if (!doc) {
    return (
      <>
        <div className="flex items-center justify-center h-96">
          <p className="text-sm text-muted-foreground">
            Không tìm thấy văn bản.
          </p>
        </div>
      </>
    );
  }

  const aiSuggestions = {
    summary: doc.summary,
    type: doc.type,
    tags: doc.tags.join(", "),
    effectiveDate: doc.effectiveDate,
    relatedDocs: doc.relatedDocs.join(", ") || "Không tìm thấy",
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  return (
    <>
      <div className="p-4 sm:p-6 animate-fade-in">
        <div className="max-w-[900px] mx-auto">
          <button
            onClick={() => navigate(`/library/${id}`)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại chi tiết
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Chỉnh sửa văn bản thư viện
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {doc.code} – {doc.title}
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
            <div className="flex-1 space-y-5">
              <div className="bg-card rounded-xl border border-border/40 p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <EditField label="Tiêu đề" defaultValue={doc.title} />
                  <EditField label="Mã văn bản" defaultValue={doc.code} />
                  <EditSelect
                    label="Cơ quan ban hành"
                    options={issuingAgencies}
                    defaultValue={doc.issuingAgency}
                  />
                  <EditSelect
                    label="Loại văn bản"
                    options={libraryDocTypes}
                    defaultValue={doc.type}
                  />
                  <EditSelect
                    label="Bảo mật"
                    options={confidentialityLevels}
                    defaultValue={doc.confidentiality}
                  />
                  <EditField
                    label="Ngày ban hành"
                    type="date"
                    defaultValue={doc.issueDate}
                  />
                  <EditField
                    label="Ngày hiệu lực"
                    type="date"
                    defaultValue={doc.effectiveDate}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">
                    Thẻ / Danh mục
                  </label>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2.5 py-1 rounded-lg bg-muted text-muted-foreground flex items-center gap-1.5"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => setTags(tags.filter((x) => x !== t))}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Thêm thẻ..."
                      className="flex-1 h-9 px-3 rounded-lg border border-border/60 bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="h-9 px-3 rounded-lg border border-border/60 bg-card text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Thêm
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">
                    Tóm tắt
                  </label>
                  <textarea
                    defaultValue={doc.summary}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-border/60 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition resize-none"
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
                  onClick={() => navigate(`/library/${id}`)}
                  className="h-10 px-5 rounded-xl border border-border/60 bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => navigate(`/library/${id}`)}
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
                    {Object.entries(aiSuggestions).map(([key, value]) => (
                      <AiSuggestionRow
                        key={key}
                        label={aiFieldLabels[key] || key}
                        value={value}
                      />
                    ))}
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
  tags: "Thẻ đề xuất",
  effectiveDate: "Ngày hiệu lực",
  relatedDocs: "Văn bản liên quan",
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
