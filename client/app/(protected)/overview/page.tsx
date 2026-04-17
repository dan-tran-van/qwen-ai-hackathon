"use client";
import {
  ConfidentialityBadge,
  StatusBadge,
} from "@/components/custom/status-badge";
import { documents } from "@/data/mock-data";
import { $api } from "@/lib/api/api";
import {
  FileText,
  Clock,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Building2,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

const metrics = [
  { label: "Hồ sơ mới", value: "12", icon: FileText, color: "text-info" },
  { label: "Đang xử lý", value: "28", icon: TrendingUp, color: "text-primary" },
  {
    label: "Quá hạn",
    value: "3",
    icon: AlertTriangle,
    color: "text-destructive",
  },
  {
    label: "Hoàn tất tuần này",
    value: "45",
    icon: Clock,
    color: "text-success",
  },
];

const deptWorkload = [
  { dept: "Phòng QLHC", count: 14, percentage: 35 },
  { dept: "Phòng KHTC", count: 10, percentage: 25 },
  { dept: "Phòng TN-MT", count: 8, percentage: 20 },
  { dept: "Phòng TH", count: 5, percentage: 12.5 },
  { dept: "Ban GĐ", count: 3, percentage: 7.5 },
];

const securityDist = [
  { level: "Thường", count: 32, pct: 64 },
  { level: "Mật", count: 12, pct: 24 },
  { level: "Tối mật", count: 5, pct: 10 },
  { level: "Tuyệt mật", count: 1, pct: 2 },
];

export default function Dashboard() {
  const { data, isLoading, error } = $api.useQuery("get", "/api/documents/");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-[1400px] mx-auto animate-fade-in">
        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-card rounded-xl p-4 sm:p-5 shadow-card border border-border/40"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {m.label}
                </span>
                <m.icon className={`h-4 w-4 ${m.color}`} />
              </div>
              <p className="text-xl sm:text-2xl font-semibold text-foreground">
                {m.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Active Queue */}
          <div className="lg:col-span-2 bg-card rounded-xl shadow-card border border-border/40">
            <div className="p-4 sm:p-5 border-b border-border/40">
              <h3 className="text-sm font-semibold text-foreground">
                Hồ sơ đang hoạt động
              </h3>
            </div>
            <div className="divide-y divide-border/30">
              {data?.results.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/incoming/${doc.id}`}
                  className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono text-muted-foreground">
                        {doc.code}
                      </span>
                      <ConfidentialityBadge level={doc.confidentiality} />
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">
                      {doc.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                      {doc.sender}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 ml-3">
                    <StatusBadge status={doc.status} />
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 hidden sm:block" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* AI Insights */}
            <div className="bg-card rounded-xl shadow-card border border-border/40 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  AI Insights
                </h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-warning/5 border border-warning/10">
                  <p className="text-xs font-medium text-foreground">
                    Cảnh báo quá hạn
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    CV-2026-0156 đã quá hạn 3 ngày. Đề xuất escalate lên Ban GĐ.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-xs font-medium text-foreground">
                    Gợi ý phân phối
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 hồ sơ mới nên chuyển Phòng KHTC dựa trên nội dung phân
                    tích.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="h-3 w-3 text-destructive" />
                    <p className="text-xs font-medium text-foreground">
                      Rủi ro tuân thủ
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    TT-2026-0081 chứa thông tin nhạy cảm, cần xử lý ưu tiên.
                  </p>
                </div>
              </div>
            </div>

            {/* Department Workload */}
            <div className="bg-card rounded-xl shadow-card border border-border/40 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">
                  Khối lượng công việc
                </h3>
              </div>
              <div className="space-y-2.5">
                {deptWorkload.map((d) => (
                  <div key={d.dept}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{d.dept}</span>
                      <span className="font-medium text-foreground">
                        {d.count}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/60 rounded-full transition-all"
                        style={{ width: `${d.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Distribution */}
            <div className="bg-card rounded-xl shadow-card border border-border/40 p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Phân bố bảo mật
              </h3>
              <div className="space-y-2">
                {securityDist.map((s) => (
                  <div
                    key={s.level}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted-foreground">{s.level}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/40 rounded-full"
                          style={{ width: `${s.pct}%` }}
                        />
                      </div>
                      <span className="font-medium text-foreground w-6 text-right">
                        {s.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
