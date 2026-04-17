"use client";
import {
  StatusBadge,
  ConfidentialityBadge,
} from "@/components/custom/status-badge";
import { DEPARTMENT_LABELS, documents } from "@/data/mock-data";
import {
  Search,
  Filter,
  Upload,
  MoreHorizontal,
  Edit3,
  Trash2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { $api } from "@/lib/api/api";
import { extractPageFromNext } from "@/lib/utils";
import { DOCUMENT_TYPE_LABEL } from "./constants";

export default function IncomingDocuments() {
  const [searchQuery, setSearchQuery] = useState("");
  const route = useRouter();
  const navigate = (path: string) => route.push(path);
  const [deleteDoc, setDeleteDoc] = useState<(typeof documents)[0] | null>(
    null,
  );
  const { data, isLoading, error } = $api.useInfiniteQuery(
    "get",
    "/api/documents/",
    {},
    {
      pageParamName: "page", // <-- important for DRF page-number style
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        // DRF returns `next` as a URL or null
        // return the *page* number (or undefined/null to stop)
        return extractPageFromNext((lastPage as any).next ?? null);
      },
    },
  );
  if (data) {
    console.log("Fetched documents:", data.pages.flat());
  }

  const filtered = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.sender.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <div className="p-4 sm:p-6 max-w-[1400px] mx-auto animate-fade-in">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm mã, tiêu đề, đơn vị gửi..."
                className="w-full h-9 pl-9 pr-4 rounded-lg border border-border/60 bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="h-9 px-3 rounded-lg border border-border/60 bg-card text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
              <Filter className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Bộ lọc</span>
            </button>
          </div>
          <button
            onClick={() => navigate("/incoming/new")}
            className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition"
          >
            <Upload className="h-3.5 w-3.5" />
            Tải lên văn bản
          </button>
        </div>

        <p className="text-xs text-muted-foreground mb-3">
          Hỗ trợ quy trình lai: scan PDF, văn bản giấy và tệp số đều được tiếp
          nhận và xử lý.
        </p>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-card rounded-xl shadow-card border border-border/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Mã số
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Tiêu đề
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Đơn vị gửi
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Ngày nhận
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Loại
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Phòng ban
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Bảo mật
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Trạng thái
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              {isLoading && (
                <tbody>
                  <tr>
                    <td colSpan={11} className="text-center py-10">
                      Đang tải...
                    </td>
                  </tr>
                </tbody>
              )}
              {data?.pages.map((page, i) => (
                <tbody key={i}>
                  {page.results.map((doc: any) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <Link
                          href={`/incoming/${doc.id}`}
                          className="text-sm font-mono text-primary hover:underline"
                        >
                          {doc.code}
                        </Link>
                      </td>
                      <td className="px-5 py-3">
                        <Link
                          href={`/incoming/${doc.id}`}
                          className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {doc.title}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">
                        {doc.sender}
                      </td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">
                        {doc.received_date}
                      </td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">
                        {DOCUMENT_TYPE_LABEL[doc.document_type]}
                      </td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">
                        {DEPARTMENT_LABELS[doc.department]}
                      </td>
                      <td className="px-5 py-3">
                        <ConfidentialityBadge level={doc.confidentiality} />
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={doc.status} />
                      </td>
                      <td className="px-3 py-3">
                        <RowMenu
                          onEdit={() => navigate(`/incoming/${doc.id}/edit`)}
                          onDelete={() => setDeleteDoc(doc)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>

        {/* Mobile/Tablet Cards */}
        {data?.pages.map((page, i) => (
          <div className="lg:hidden space-y-2" key={i}>
            {page.results.map((doc: any) => (
              <div
                key={doc.id}
                className="bg-card rounded-xl border border-border/40 p-4 hover:shadow-card transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/document/${doc.id}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-xs font-mono text-primary">
                        {doc.code}
                      </span>
                      <ConfidentialityBadge level={doc.confidentiality} />
                      <StatusBadge status={doc.status} />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      {doc.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {doc.sender} · {doc.received_date} · {doc.type}
                    </p>
                  </Link>
                  <RowMenu
                    onEdit={() => navigate(`/incoming/${doc.id}/edit`)}
                    onDelete={() => setDeleteDoc(doc)}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Delete dialog */}
      <Dialog open={!!deleteDoc} onOpenChange={(v) => !v && setDeleteDoc(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Xóa hồ sơ</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa hồ sơ <strong>{deleteDoc?.code}</strong>
              ? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <button
              onClick={() => setDeleteDoc(null)}
              className="h-9 px-4 rounded-lg border border-border/60 bg-card text-sm font-medium hover:bg-muted transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={() => setDeleteDoc(null)}
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

function RowMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 w-40 bg-popover rounded-lg border border-border shadow-lg py-1 animate-fade-in">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onEdit();
            }}
            className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" /> Chỉnh sửa
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDelete();
            }}
            className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/5 flex items-center gap-2 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Xóa
          </button>
        </div>
      )}
    </div>
  );
}
