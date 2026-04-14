"use client";
import {
  BarChart3,
  Clock,
  TrendingDown,
  AlertTriangle,
  FileText,
} from "lucide-react";

const processingData = [
  { month: "T1", avg: 4.2 },
  { month: "T2", avg: 3.8 },
  { month: "T3", avg: 3.5 },
  { month: "T4", avg: 3.1 },
];

const departmentBottlenecks = [
  { dept: "Phòng QLHC", backlog: 14, avgDays: 4.5, overdue: 2 },
  { dept: "Phòng KHTC", backlog: 10, avgDays: 3.2, overdue: 1 },
  { dept: "Phòng TN-MT", backlog: 8, avgDays: 5.1, overdue: 3 },
  { dept: "Ban GĐ", backlog: 3, avgDays: 2.8, overdue: 0 },
  { dept: "Phòng TH", backlog: 5, avgDays: 3.0, overdue: 0 },
];

const docTypes = [
  { type: "Công văn", count: 42, pct: 35 },
  { type: "Báo cáo", count: 28, pct: 23 },
  { type: "Phiếu trình", count: 20, pct: 17 },
  { type: "Thông báo", count: 15, pct: 13 },
  { type: "Văn bản khác", count: 15, pct: 12 },
];

export default function Analytics() {
  return (
    <>
      <div className="p-4 sm:p-6 max-w-[1200px] mx-auto animate-fade-in">
        {/* Top metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-card rounded-xl p-4 sm:p-5 shadow-card border border-border/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">
                Thời gian xử lý TB
              </span>
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xl sm:text-2xl font-semibold text-foreground">
              3.1{" "}
              <span className="text-sm font-normal text-muted-foreground">
                ngày
              </span>
            </p>
            <p className="text-xs text-success mt-1">
              ↓ 12% so với tháng trước
            </p>
          </div>
          <div className="bg-card rounded-xl p-4 sm:p-5 shadow-card border border-border/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">
                Hồ sơ tồn đọng
              </span>
              <TrendingDown className="h-4 w-4 text-warning" />
            </div>
            <p className="text-xl sm:text-2xl font-semibold text-foreground">
              40
            </p>
            <p className="text-xs text-warning mt-1">↑ 5% so với tháng trước</p>
          </div>
          <div className="bg-card rounded-xl p-4 sm:p-5 shadow-card border border-border/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">
                Quá hạn
              </span>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-xl sm:text-2xl font-semibold text-foreground">
              6
            </p>
            <p className="text-xs text-destructive mt-1">3 cần escalate</p>
          </div>
          <div className="bg-card rounded-xl p-4 sm:p-5 shadow-card border border-border/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">
                Tổng xử lý tháng
              </span>
              <FileText className="h-4 w-4 text-info" />
            </div>
            <p className="text-xl sm:text-2xl font-semibold text-foreground">
              120
            </p>
            <p className="text-xs text-success mt-1">↑ 8% so với tháng trước</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Processing time trend */}
          <div className="bg-card rounded-xl shadow-card border border-border/40 p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Xu hướng thời gian xử lý
            </h3>
            <div className="flex items-end gap-4 h-32">
              {processingData.map((d) => (
                <div
                  key={d.month}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-xs font-medium text-foreground">
                    {d.avg}d
                  </span>
                  <div
                    className="w-full bg-primary/20 rounded-t-md"
                    style={{ height: `${(d.avg / 5) * 100}%` }}
                  >
                    <div className="w-full h-full bg-primary/60 rounded-t-md" />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {d.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Document types */}
          <div className="bg-card rounded-xl shadow-card border border-border/40 p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Loại văn bản phổ biến
            </h3>
            <div className="space-y-3">
              {docTypes.map((d) => (
                <div key={d.type}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{d.type}</span>
                    <span className="font-medium text-foreground">
                      {d.count} ({d.pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/50 rounded-full transition-all"
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottlenecks - desktop table, mobile cards */}
        <div className="bg-card rounded-xl shadow-card border border-border/40">
          <div className="p-4 sm:p-5 border-b border-border/40">
            <h3 className="text-sm font-semibold text-foreground">
              Tắc nghẽn theo phòng ban
            </h3>
          </div>
          {/* Desktop */}
          <div className="hidden sm:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Phòng ban
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Tồn đọng
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    TB ngày xử lý
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Quá hạn
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {departmentBottlenecks.map((d) => (
                  <tr
                    key={d.dept}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-3 text-sm text-foreground">
                      {d.dept}
                    </td>
                    <td className="px-5 py-3 text-sm text-foreground text-right">
                      {d.backlog}
                    </td>
                    <td className="px-5 py-3 text-sm text-foreground text-right">
                      {d.avgDays}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`text-sm font-medium ${d.overdue > 0 ? "text-destructive" : "text-success"}`}
                      >
                        {d.overdue}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile */}
          <div className="sm:hidden divide-y divide-border/30">
            {departmentBottlenecks.map((d) => (
              <div key={d.dept} className="p-4">
                <p className="text-sm font-medium text-foreground mb-2">
                  {d.dept}
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Tồn đọng</span>
                    <p className="font-medium text-foreground">{d.backlog}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">TB ngày</span>
                    <p className="font-medium text-foreground">{d.avgDays}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quá hạn</span>
                    <p
                      className={`font-medium ${d.overdue > 0 ? "text-destructive" : "text-success"}`}
                    >
                      {d.overdue}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
