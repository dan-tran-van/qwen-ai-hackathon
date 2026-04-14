"use client";
import { auditLog } from "@/data/mock-data";
import { Shield, Users, Lock, Eye, Search, AlertTriangle } from "lucide-react";
import { useState } from "react";

const roles = [
  {
    role: "Văn thư",
    permissions: ["Tiếp nhận", "Đăng ký", "Phát hành"],
    users: 4,
  },
  {
    role: "Chuyên viên",
    permissions: ["Xử lý", "Ghi chú", "Xin ý kiến"],
    users: 12,
  },
  {
    role: "Lãnh đạo phòng",
    permissions: ["Phê duyệt", "Chuyển tiếp", "Escalate"],
    users: 6,
  },
  {
    role: "Quản trị hệ thống",
    permissions: ["Toàn quyền", "Cấu hình", "Audit"],
    users: 2,
  },
];

const confidentialityMatrix = [
  {
    level: "Thường",
    vanthu: true,
    chuyenvien: true,
    lanhdao: true,
    quantri: true,
  },
  {
    level: "Mật",
    vanthu: false,
    chuyenvien: true,
    lanhdao: true,
    quantri: true,
  },
  {
    level: "Tối mật",
    vanthu: false,
    chuyenvien: false,
    lanhdao: true,
    quantri: true,
  },
  {
    level: "Tuyệt mật",
    vanthu: false,
    chuyenvien: false,
    lanhdao: false,
    quantri: true,
  },
];

export default function SecurityAudit() {
  const [searchLog, setSearchLog] = useState("");

  const filteredLog = auditLog.filter(
    (a) =>
      a.user.toLowerCase().includes(searchLog.toLowerCase()) ||
      a.action.toLowerCase().includes(searchLog.toLowerCase()) ||
      a.document.toLowerCase().includes(searchLog.toLowerCase()),
  );

  return (
    <div className="p-4 sm:p-6 max-w-[1200px] mx-auto animate-fade-in space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Roles */}
        <div className="bg-card rounded-xl shadow-card border border-border/40 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Vai trò & Quyền hạn
            </h3>
          </div>
          <div className="space-y-3">
            {roles.map((r) => (
              <div
                key={r.role}
                className="p-3 rounded-lg bg-muted/30 border border-border/30"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-foreground">
                    {r.role}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {r.users} người dùng
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {r.permissions.map((p) => (
                    <span
                      key={p}
                      className="text-[10px] px-2 py-0.5 rounded bg-accent text-accent-foreground"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confidentiality Matrix */}
        <div className="bg-card rounded-xl shadow-card border border-border/40 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Ma trận bảo mật
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">
                    Mức độ
                  </th>
                  <th className="text-center py-2 text-xs font-medium text-muted-foreground">
                    Văn thư
                  </th>
                  <th className="text-center py-2 text-xs font-medium text-muted-foreground">
                    CV
                  </th>
                  <th className="text-center py-2 text-xs font-medium text-muted-foreground">
                    LĐ
                  </th>
                  <th className="text-center py-2 text-xs font-medium text-muted-foreground">
                    QT
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {confidentialityMatrix.map((row) => (
                  <tr key={row.level}>
                    <td className="py-2.5 text-sm text-foreground">
                      {row.level}
                    </td>
                    <td className="text-center">
                      <AccessDot allowed={row.vanthu} />
                    </td>
                    <td className="text-center">
                      <AccessDot allowed={row.chuyenvien} />
                    </td>
                    <td className="text-center">
                      <AccessDot allowed={row.lanhdao} />
                    </td>
                    <td className="text-center">
                      <AccessDot allowed={row.quantri} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-warning/5 border border-warning/10">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3 text-warning" />
              <span className="text-xs font-medium text-foreground">
                Lưu ý bảo mật
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              1 văn bản Tuyệt mật đang chờ phê duyệt. Chỉ quản trị viên được
              phép truy cập.
            </p>
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-card rounded-xl shadow-card border border-border/40">
        <div className="p-4 sm:p-5 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Nhật ký hoạt động
            </h3>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm nhật ký..."
              className="w-full h-8 pl-8 pr-3 rounded-lg border border-border/60 bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition"
              value={searchLog}
              onChange={(e) => setSearchLog(e.target.value)}
            />
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Thời gian
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Người dùng
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Hành động
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Văn bản
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Phòng ban
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Chi tiết
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredLog.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-5 py-3 text-xs text-muted-foreground font-mono">
                    {entry.timestamp}
                  </td>
                  <td className="px-5 py-3 text-sm text-foreground">
                    {entry.user}
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-accent text-accent-foreground">
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs font-mono text-primary">
                    {entry.document}
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">
                    {entry.department}
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">
                    {entry.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-border/30">
          {filteredLog.map((entry) => (
            <div key={entry.id} className="p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-foreground">
                  {entry.user}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-accent text-accent-foreground">
                  {entry.action}
                </span>
              </div>
              <p className="text-xs font-mono text-primary mb-1">
                {entry.document}
              </p>
              <p className="text-xs text-muted-foreground">{entry.detail}</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {entry.timestamp} · {entry.department}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AccessDot({ allowed }: { allowed: boolean }) {
  return (
    <div className="flex justify-center">
      <div
        className={`h-2.5 w-2.5 rounded-full ${allowed ? "bg-primary" : "bg-border"}`}
      />
    </div>
  );
}
