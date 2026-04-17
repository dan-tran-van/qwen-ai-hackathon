"use client";

import { useCallback, useState } from "react";
import { Loader2, Send, Bot } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { $api } from "@/lib/api/api";
import { useQueryClient } from "@tanstack/react-query";

const defaultSuggestions = [
  "Hướng dẫn quy trình xử lý hồ sơ",
  "So sánh hai văn bản pháp quy",
  "Phân tích rủi ro văn bản",
];

export default function AIChatEntryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: createConversation, isPending } = $api.useMutation(
    "post",
    "/api/chats/conversations/create/",
  );

  const handleSendMessage = useCallback(
    async (content: string = message) => {
      if (!content.trim()) return;

      setError(null);

      try {
        const response = await createConversation({
          body: {
            content: content,
          },
        });

        await queryClient.invalidateQueries();

        const query = searchParams.toString();
        const targetPath = query
          ? `/ai-assistant/${response.id}?${query}`
          : `/ai-assistant/${response.id}`;
        router.replace(targetPath);
      } catch {
        setError("Khong the tao cuoc tro chuyen moi. Vui long thu lai.");
      }
    },
    [message, createConversation, queryClient, router, searchParams],
  );

  const handleSugestionClick = (suggestion: string) => {
    setMessage(suggestion);
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] animate-fade-in">
      {/* Welcome Message */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-[700px] mx-auto space-y-6">
          <div className="flex gap-3">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bot className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="text-foreground">
              <p className="text-sm leading-relaxed">
                Xin chào! Tôi là trợ lý AI của hệ thống Government Flow. Bạn có
                thể đặt câu hỏi chung hoặc cung cấp chi tiết cần phân tích.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="px-4 sm:px-6 pb-4">
        <div className="max-w-[700px] mx-auto flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">Các câu hỏi gợi ý:</p>
          <div className="flex flex-wrap gap-2">
            {defaultSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSugestionClick(s)}
                disabled={isPending}
                className="text-xs px-3 py-1.5 rounded-lg border border-border/60 bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Composer */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
        <div className="max-w-[700px] mx-auto">
          <div className="flex items-end gap-2 bg-card rounded-xl border border-border/60 shadow-card p-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Nhập tin nhắn..."
              disabled={isPending}
              className="flex-1 h-9 px-2 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isPending || !message.trim()}
              className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition disabled:opacity-40 flex-shrink-0"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        </div>
      </div>
    </div>
  );
}
