"use client";
import { useState, useRef } from "react";
import { ArrowLeft, Upload, X, FileText, Loader2 } from "lucide-react";
import { departments } from "@/data/mock-data";

import type { DocumentStatus, Confidentiality } from "@/data/mock-data";
import { useRouter } from "next/navigation";
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

export default function WorkflowUpload() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync } = $api.useMutation("post", "/api/documents/upload/");

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setSelectedFile(file);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedFile) {
      setError("Vui lòng chọn tệp đính kèm trước khi lưu.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Build multipart/form-data body
      const formData = new FormData();
      formData.append("file", selectedFile);

      await mutateAsync({
        // openapi-fetch passes body as-is for multipart
        body: formData as any,
      });

      navigate("/incoming");
    } catch (err: any) {
      setError(err?.message ?? "Đã xảy ra lỗi khi tải lên. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      <div className="max-w-[800px] mx-auto">
        <button
          onClick={() => navigate("/incoming")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </button>

        <h1 className="text-xl font-semibold text-foreground mb-1">
          Tạo hồ sơ mới
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Nhập thông tin văn bản đến và tải lên tệp đính kèm.
        </p>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Metadata fields (uncomment when API supports them) */}
          {/* <div className="bg-card rounded-xl border border-border/40 p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Tiêu đề *" placeholder="Nhập tiêu đề văn bản" />
              <Field label="Mã số" placeholder="VD: CV-2026-0200" />
              <Field label="Đơn vị gửi" placeholder="Nhập đơn vị gửi" />
              <SelectField label="Phòng ban" options={departments} />
              <SelectField label="Loại văn bản" options={docTypes} />
              <SelectField label="Bảo mật" options={confidentialityLevels} />
              <SelectField label="Trạng thái" options={statuses} />
              <Field label="Ngày nhận" type="date" />
            </div>
          </div> */}

          {/* File upload */}
          <div className="bg-card rounded-xl border border-border/40 p-4 sm:p-6">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">
              Tệp đính kèm <span className="text-destructive">*</span>
            </label>

            {selectedFile ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="flex-1 truncate">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {(selectedFile.size / 1024).toFixed(0)} KB
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  isDragging
                    ? "border-primary/60 bg-primary/10"
                    : "border-border/60 hover:border-primary/30 hover:bg-primary/5"
                }`}
              >
                <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Kéo thả hoặc nhấn để chọn tệp
                </span>
                <span className="text-xs text-muted-foreground/60 mt-1">
                  PDF, DOCX, hình ảnh scan
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                  onChange={(e) =>
                    handleFileChange(e.target.files?.[0] ?? null)
                  }
                />
              </div>
            )}

            {/* Error message */}
            {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate("/incoming")}
              disabled={isSubmitting}
              className="h-10 px-5 rounded-xl border border-border/60 bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedFile}
              className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Đang lưu..." : "Lưu hồ sơ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
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
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition"
      />
    </div>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground mb-1.5 block">
        {label}
      </label>
      <select className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition">
        <option value="">Chọn...</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
