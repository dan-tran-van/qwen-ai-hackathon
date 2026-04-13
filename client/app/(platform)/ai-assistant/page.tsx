"use client";

import { Input } from "@/components/ui/input";
import {
  LucideBot,
  LucideChevronDown,
  LucidePanelRightClose,
  LucidePaperclip,
  LucideSend,
  LucideSparkles,
  LucideUpload,
} from "lucide-react";

export default function AIAssistantPage() {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-56px)] animate-fade-in">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden flex justify-end px-4 pt-2">
          <button className="h-8 px-3 rounded-lg border border-border/60 bg-card text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
            <LucidePanelRightClose />
            Ẩn
          </button>
        </div>
        <div className="lg:hidden px-4 pt-2">
          <div className="bg-card rounded-xl border border-border/40 p-3 mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Văn bản
              </span>
              <button className="text-[10px] text-primary">Đổi</button>
            </div>
            <span className="text-[10px] font-mono text-primary">
              CV-2026-0142
            </span>
            <p className="text-xs font-medium text-foreground">
              Công văn đề nghị cấp phép hoạt động
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="w-full mx-auto space-y-6">
            <div className="flex gap-3 ">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <LucideBot className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="max-w-[85%] text-foreground">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  Xin chào! Tôi là trợ lý AI của hệ thống Government Flow. Bạn
                  có thể tải lên văn bản mới hoặc chọn hồ sơ hiện có để tôi hỗ
                  trợ phân tích, tóm tắt, và trả lời câu hỏi.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 pb-2">
          <div className="w-full mx-auto flex flex-wrap gap-2">
            <button className="text-xs px-3 py-1.5 rounded-lg border border-border/60 bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              Tóm tắt văn bản này
            </button>
            <button className="text-xs px-3 py-1.5 rounded-lg border border-border/60 bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              Hạn xử lý là khi nào?
            </button>
            <button className="text-xs px-3 py-1.5 rounded-lg border border-border/60 bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              Phòng ban nào phụ trách?
            </button>
            <button className="text-xs px-3 py-1.5 rounded-lg border border-border/60 bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              Có rủi ro gì không?
            </button>
            <button className="text-xs px-3 py-1.5 rounded-lg border border-border/60 bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              Văn bản liên quan?
            </button>
          </div>
        </div>
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
          <div className="w-full mx-auto">
            <div className="flex items-end gap-2 bg-card rounded-xl border border-border/60 shadow-card p-2">
              <button className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0 cursor-pointer">
                <LucideUpload className="h-4 w-4" />
              </button>
              <button className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0 hidden sm:flex cursor-pointer">
                <LucidePaperclip className="h-4 w-4" />
              </button>
              <Input
                className="flex-1 h-9 px-2 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
                placeholder="Hỏi về văn bản đang chọn..."
              />
              <button className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition disabled:opacity-40 flex-shrink-0 cursor-pointer">
                <LucideSend className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex w-[320px] border-l border-border/40 bg-card/30 flex-col">
        <div className="p-4 border-b border-border/40">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
              Văn bản đang chọn
            </h4>
            <button className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer">
              Đổi <LucideChevronDown className="h-3 w-3" />
            </button>
          </div>
          <div className="bg-card rounded-lg border border-border/40 p-3">
            <span className="text-[10px] font-mono text-primary">
              CV-2026-0142
            </span>
            <p className="text-sm font-medium text-foreground mt-0.5">
              Công văn đề nghị cấp phép hoạt động
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Sở Kế hoạch và Đầu tư
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div>
            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Metadata
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loại</span>
                <span className="text-foreground">Công văn</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hạn</span>
                <span className="text-foreground">2026-04-18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bảo mật</span>
                <span className="text-foreground">Thường</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phòng ban</span>
                <span className="text-foreground">
                  Phòng Quản lý Hành chính
                </span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Tóm tắt AI
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Đề nghị xem xét cấp giấy phép hoạt động cho Công ty TNHH ABC tại
              khu vực quận 7. Hồ sơ đầy đủ theo quy định tại Nghị định
              01/2021/NĐ-CP.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              <LucideSparkles />
              Confidence: 94%
            </h4>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary/60 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
