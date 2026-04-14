"use client";
import { useState } from "react";
import { libraryDocuments, libraryStatusColors } from "@/data/library-data";
import { confidentialityColors } from "@/data/mock-data";
import {
  ArrowLeft,
  Bot,
  FileText,
  Calendar,
  Building2,
  Tag,
  Shield,
  ExternalLink,
  Edit3,
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
import { useParams, useRouter } from "next/navigation";

export default function LibraryDetail() {
  const { id } = useParams();
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const doc = libraryDocuments.find((d) => d.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const handleAskAI = () => {
    navigate(`/ai-assistant?libraryDoc=${doc.id}`);
  };

  return (
    <>
      <div className="p-4 sm:p-6 animate-fade-in">
        <div className="max-w-[1100px] mx-auto">
          <button
            onClick={() => navigate("/library")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại thư viện
          </button>

          {/* Mobile: Actions at top */}
          <div className="lg:hidden mb-4 flex flex-wrap gap-2">
            <button
              onClick={handleAskAI}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
            >
              <Bot className="h-4 w-4" />
              Hỏi AI
            </button>
            <button
              onClick={() => navigate(`/library/${id}/edit`)}
              className="h-11 px-4 rounded-xl border border-border/60 bg-card text-sm font-medium text-foreground flex items-center gap-2 hover:bg-muted transition-colors"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="h-11 px-4 rounded-xl border border-destructive/30 text-sm font-medium text-destructive flex items-center gap-2 hover:bg-destructive/5 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="bg-card rounded-xl border border-border/40 p-4 sm:p-6 mb-4">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-xs font-mono text-primary">
                    {doc.code}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md ${libraryStatusColors[doc.status]}`}
                  >
                    {doc.status}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md ${confidentialityColors[doc.confidentiality]}`}
                  >
                    {doc.confidentiality}
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                  {doc.title}
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {doc.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {doc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border/40 p-4 sm:p-6">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  Nội dung văn bản
                </h3>
                <div className="prose prose-sm max-w-none text-foreground/80">
                  <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed bg-muted/30 rounded-lg p-4 border border-border/30 overflow-x-auto">
                    {doc.content}
                  </pre>
                </div>
              </div>

              {doc.relatedDocs.length > 0 && (
                <div className="bg-card rounded-xl border border-border/40 p-4 sm:p-6 mt-4">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Văn bản liên quan
                  </h3>
                  <div className="space-y-2">
                    {doc.relatedDocs.map((code) => {
                      const related = libraryDocuments.find(
                        (d) => d.code === code,
                      );
                      return (
                        <button
                          key={code}
                          onClick={() =>
                            related && navigate(`/library/${related.id}`)
                          }
                          className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="text-xs font-mono text-primary">
                              {code}
                            </span>
                            {related && (
                              <p className="text-sm text-foreground truncate">
                                {related.title}
                              </p>
                            )}
                          </div>
                          <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 ml-auto flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Side panel */}
            <div className="w-full lg:w-[300px] flex-shrink-0 space-y-4">
              {/* Desktop actions */}
              <div className="hidden lg:flex flex-col gap-2">
                <button
                  onClick={handleAskAI}
                  className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
                >
                  <Bot className="h-4 w-4" />
                  Hỏi AI về văn bản này
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/library/${id}/edit`)}
                    className="flex-1 h-9 rounded-xl border border-border/60 bg-card text-sm font-medium text-foreground flex items-center justify-center gap-2 hover:bg-muted transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Chỉnh sửa
                  </button>
                  <button
                    onClick={() => setShowDeleteDialog(true)}
                    className="h-9 px-4 rounded-xl border border-destructive/30 text-sm font-medium text-destructive flex items-center justify-center gap-2 hover:bg-destructive/5 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-card rounded-xl border border-border/40 p-4 sm:p-5">
                <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Thông tin
                </h3>
                <div className="space-y-3 text-xs">
                  <MetaRow
                    icon={Building2}
                    label="Cơ quan ban hành"
                    value={doc.issuingAgency}
                  />
                  <MetaRow
                    icon={FileText}
                    label="Loại văn bản"
                    value={doc.type}
                  />
                  <MetaRow
                    icon={Calendar}
                    label="Ngày ban hành"
                    value={doc.issueDate}
                  />
                  <MetaRow
                    icon={Calendar}
                    label="Ngày hiệu lực"
                    value={doc.effectiveDate}
                  />
                  <MetaRow
                    icon={Shield}
                    label="Bảo mật"
                    value={doc.confidentiality}
                  />
                  <MetaRow icon={Tag} label="Mã văn bản" value={doc.code} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Xóa văn bản</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa văn bản <strong>{doc.code}</strong> khỏi
              thư viện? Hành động này không thể hoàn tác.
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
                navigate("/library");
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

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-muted-foreground">{label}</p>
        <p className="text-foreground font-medium">{value}</p>
      </div>
    </div>
  );
}
