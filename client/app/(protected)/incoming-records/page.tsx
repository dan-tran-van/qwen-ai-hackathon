"use client";
import {
  StatusBadge,
  ConfidentialityBadge,
} from "@/components/custom/status-badge";
import { documents } from "@/data/mock-data";
import { Search, Filter, Upload, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function IncomingDocuments() {
  const [searchQuery, setSearchQuery] = useState("");

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
          <button className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition">
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
              <tbody className="divide-y divide-border/30">
                {filtered.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/document/${doc.id}`}
                        className="text-sm font-mono text-primary hover:underline"
                      >
                        {doc.code}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/document/${doc.id}`}
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {doc.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">
                      {doc.sender}
                    </td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">
                      {doc.receivedDate}
                    </td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">
                      {doc.type}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {doc.suggestedDept}
                    </td>
                    <td className="px-5 py-3">
                      <ConfidentialityBadge level={doc.confidentiality} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="px-3 py-3">
                      <button className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="lg:hidden space-y-2">
          {filtered.map((doc) => (
            <Link
              key={doc.id}
              href={`/document/${doc.id}`}
              className="block bg-card rounded-xl border border-border/40 p-4 hover:shadow-card transition-all"
            >
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
                {doc.sender} · {doc.receivedDate} · {doc.type}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
