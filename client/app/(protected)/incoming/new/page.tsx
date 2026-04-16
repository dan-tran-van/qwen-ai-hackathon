"use client";
import { useState } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
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
  const [fileName, setFileName] = useState("");
  const { mutateAsync } = $api.useMutation("post", "/api/documents/upload/");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/incoming");
  };

  return (
    <>
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
                Tệp đính kèm
              </label>
              {fileName ? (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm">
                  <span className="flex-1 truncate">{fileName}</span>
                  <button
                    type="button"
                    onClick={() => setFileName("")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border/60 rounded-xl cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Kéo thả hoặc nhấn để chọn tệp
                  </span>
                  <span className="text-xs text-muted-foreground/60 mt-1">
                    PDF, DOCX, hình ảnh scan
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] && setFileName(e.target.files[0].name)
                    }
                  />
                </label>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={() => navigate("/incoming")}
                className="h-10 px-5 rounded-xl border border-border/60 bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
              >
                Lưu hồ sơ
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
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
