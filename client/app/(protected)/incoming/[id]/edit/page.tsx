"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, Sparkles, Check, RotateCcw, Upload, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { $api } from "@/lib/api/api";
import {
  DEPARTMENT_TYPE_LABEL,
  DOCUMENT_CONFIDENTIALITY_LABEL,
  DOCUMENT_STATUS_LABEL,
  DOCUMENT_TYPE_LABEL,
} from "../../constants";
import { useQueryClient } from "@tanstack/react-query";

export default function WorkflowEdit() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
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

  const { mutate: updateDoc, isPending: isSaving } = $api.useMutation(
    "put",
    "/api/documents/{id}/update/",
  );

  const navigate = (path: string) => router.push(path);
  // const doc = documents.find((d) => d.id === id);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [fileName, setFileName] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    sender: "",
    department: "",
    document_type: "",
    confidentiality: "",
    status: "",
    deadline: "",
    summary: "",
  });

  useEffect(() => {
    if (doc) {
      setFormData({
        title: doc.title ?? "",
        code: doc.code ?? "",
        sender: doc.sender ?? "",
        department: doc.department ?? "",
        document_type: doc.document_type ?? "",
        confidentiality: doc.confidentiality ?? "",
        status: doc.status ?? "",
        deadline: doc.deadline ?? "",
        summary: doc.summary ?? "",
      });
    }
  }, [doc]);

  const objToArray = (obj: Record<string, string>) => {
    return Object.entries(obj).map(([key, value]) => ({
      label: value,
      value: key,
    }));
  };

  const onChangeField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSave = async () => {
    updateDoc(
      {
        params: { path: { id: String(id) } },
        body: {
          title: formData.title,
          code: formData.code,
          sender: formData.sender,
          department: formData.department as any,
          document_type: formData.document_type as any,
          confidentiality: formData.confidentiality as any,
          status: formData.status as any,
          deadline: formData.deadline || null,
          summary: formData.summary,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              "get",
              "/api/documents/{id}/",
              {
                params: { path: { id: String(id) } },
              },
            ],
          });

          router.push(`/incoming/${id}`);
        },
      },
    );
  };

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
            {/* <button
              onClick={() => setShowAiSuggestions(!showAiSuggestions)}
              className={`h-9 px-4 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                showAiSuggestions
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "border border-border/60 bg-card text-foreground hover:bg-muted"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              {showAiSuggestions ? "Ẩn gợi ý AI" : "AI phân tích lại"}
            </button> */}
          </div>

          <div className="flex flex-col lg:flex-row gap-5">
            {/* Form */}
            <div className="flex-1 space-y-5">
              <div className="bg-card rounded-xl border border-border/40 p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <EditField
                    label="Tiêu đề"
                    value={formData.title}
                    onChange={(v) => onChangeField("title", v)}
                  />

                  <EditField
                    label="Mã số"
                    value={formData.code}
                    onChange={(v) => onChangeField("code", v)}
                  />

                  <EditField
                    label="Đơn vị gửi"
                    value={formData.sender}
                    onChange={(v) => onChangeField("sender", v)}
                  />

                  <EditSelect
                    label="Phòng ban"
                    options={objToArray(DEPARTMENT_TYPE_LABEL)}
                    value={formData.department}
                    onChange={(v) => onChangeField("department", v)}
                  />

                  <EditSelect
                    label="Loại văn bản"
                    options={objToArray(DOCUMENT_TYPE_LABEL)}
                    value={formData.document_type}
                    onChange={(v) => onChangeField("document_type", v)}
                  />

                  <EditSelect
                    label="Bảo mật"
                    options={objToArray(DOCUMENT_CONFIDENTIALITY_LABEL)}
                    value={formData.confidentiality}
                    onChange={(v) => onChangeField("confidentiality", v)}
                  />

                  <EditSelect
                    label="Trạng thái"
                    options={objToArray(DOCUMENT_STATUS_LABEL)}
                    value={formData.status}
                    onChange={(v) => onChangeField("status", v)}
                  />

                  <EditField
                    label="Hạn xử lý"
                    type="date"
                    value={formData.deadline}
                    onChange={(v) => onChangeField("deadline", v)}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">
                    Tóm tắt
                  </label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) => onChangeField("summary", e.target.value)}
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
                {doc?.attachments?.[0]?.file_name ||
                doc?.attachments?.[0]?.file_name_alt ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm">
                    <span className="flex-1 truncate">
                      {doc.attachments[0].file_name ||
                        doc.attachments[0].file_name_alt}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {doc.attachments[0].file_size_mb} MB
                    </span>
                    {/* <label className="text-xs text-primary hover:underline cursor-pointer">
                      Thay
                      <input
                        type="file"
                        className="hidden"  
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          setFileName(e.target.files[0].name)
                        }
                      />
                    </label> */}
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
                  onClick={() => onSave()}
                  disabled={isSaving}
                  className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
                >
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
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
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value?: string | null;
  onChange?: (v: string) => void;
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
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition"
      />
    </div>
  );
}

type selectOptions = {
  label?: string;
  value?: string;
};

function EditSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: selectOptions[];
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground mb-1.5 block">
        {label}
      </label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
