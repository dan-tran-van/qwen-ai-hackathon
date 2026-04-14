"use client";
import { useState, useMemo } from "react";
import { Search, Upload, Filter, BookOpen, X } from "lucide-react";
import {
  libraryDocuments,
  libraryDocTypes,
  issuingAgencies,
  libraryStatusColors,
} from "@/data/library-data";
import { confidentialityColors } from "@/data/mock-data";
import { useRouter } from "next/navigation";

export default function Library() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [agencyFilter, setAgencyFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return libraryDocuments.filter((d) => {
      const matchSearch =
        !search ||
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.code.toLowerCase().includes(search.toLowerCase()) ||
        d.issuingAgency.toLowerCase().includes(search.toLowerCase());
      const matchType = !typeFilter || d.type === typeFilter;
      const matchAgency = !agencyFilter || d.issuingAgency === agencyFilter;
      return matchSearch && matchType && matchAgency;
    });
  }, [search, typeFilter, agencyFilter]);

  const hasActiveFilters = typeFilter || agencyFilter;

  return (
    <>
      <div className="p-4 sm:p-6 animate-fade-in">
        <div className="max-w-[1100px] mx-auto">
          <div className="mb-5 sm:mb-6">
            <h1 className="text-xl font-semibold text-foreground">
              Thư viện văn bản
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Kho lưu trữ các văn bản pháp quy, quy trình, biểu mẫu và hướng dẫn
              chính thức.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo mã, tiêu đề, cơ quan ban hành..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-border/60 bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`h-10 px-4 rounded-xl border text-sm font-medium flex items-center gap-2 transition-colors ${
                  showFilters || hasActiveFilters
                    ? "border-primary/30 bg-primary/5 text-primary"
                    : "border-border/60 bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <Filter className="h-4 w-4" />
                Bộ lọc
              </button>
              <button
                onClick={() => navigate("/library/new")}
                className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition"
              >
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Tải lên</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-9 px-3 rounded-lg border border-border/60 bg-card text-sm text-foreground focus:outline-none"
              >
                <option value="">Loại văn bản</option>
                {libraryDocTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                value={agencyFilter}
                onChange={(e) => setAgencyFilter(e.target.value)}
                className="h-9 px-3 rounded-lg border border-border/60 bg-card text-sm text-foreground focus:outline-none"
              >
                <option value="">Cơ quan ban hành</option>
                {issuingAgencies.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setTypeFilter("");
                    setAgencyFilter("");
                  }}
                  className="h-9 px-3 rounded-lg text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <X className="h-3 w-3" /> Xóa bộ lọc
                </button>
              )}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {search || hasActiveFilters
                  ? "Không tìm thấy văn bản phù hợp."
                  : "Chưa có văn bản nào trong thư viện."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => navigate(`/library/${doc.id}`)}
                  className="w-full text-left bg-card rounded-xl border border-border/40 p-4 hover:border-border hover:shadow-card transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[11px] font-mono text-primary">
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
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {doc.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {doc.issuingAgency} · {doc.type} · {doc.issueDate}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 flex-shrink-0">
                      {doc.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
