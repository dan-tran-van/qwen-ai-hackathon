"use client";
import { $api } from "@/lib/api/api";
import { components } from "@/lib/api/v1";
import {
  Search as SearchIcon,
  MessageSquare,
  Clock,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Conversation = components["schemas"]["Conversation"];

export default function SearchArchive() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const searchConversationsQuery = $api.useQuery(
    "get",
    "/api/chats/conversations/search/",
    {
      params: {
        query: {
          q: debouncedQuery,
        },
      },
    },
    {
      enabled: Boolean(debouncedQuery),
      refetchOnWindowFocus: false,
    },
  );

  const allConversationsQuery = $api.useQuery(
    "get",
    "/api/chats/conversations/",
    undefined,
    {
      refetchOnWindowFocus: false,
    },
  );

  const results = useMemo(() => {
    return searchConversationsQuery.data?.results ?? [];
  }, [searchConversationsQuery.data]);

  const recentChats = useMemo(() => {
    return (allConversationsQuery.data?.results ?? []).slice(0, 5);
  }, [allConversationsQuery.data]);

  const formatDate = (conversation: Conversation) => {
    if (!conversation.last_message_at) return "-";
    return new Date(conversation.last_message_at).toLocaleDateString("vi-VN");
  };

  const subtitle = (conversation: Conversation) => {
    return conversation.system_prompt || "Chưa có nội dung xem trước";
  };

  return (
    <>
      <div className="p-4 sm:p-6 max-w-175 mx-auto animate-fade-in">
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Tìm kiếm cuộc trò chuyện
          </h3>
          <p className="text-sm text-muted-foreground">
            Tìm trong lịch sử trò chuyện với trợ lý AI
          </p>
        </div>

        <div className="relative mb-6">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, nội dung, mã văn bản..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-border/60 bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 shadow-card transition"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {query.trim() ? (
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground mb-3">
              {results.length} kết quả
            </p>
            {searchConversationsQuery.isLoading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : searchConversationsQuery.isError ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">
                  Khong the tai ket qua tim kiem. Vui long thu lai.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <SearchIcon className="h-8 w-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">
                  Không tìm thấy cuộc trò chuyện phù hợp
                </p>
              </div>
            ) : (
              results.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => router.push(`/ai-assistant/${chat.id}`)}
                  className="w-full text-left bg-card rounded-xl border border-border/40 p-4 hover:border-border hover:shadow-card transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {chat.title || "Cuoc tro chuyen"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {subtitle(chat)}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(chat)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Gần đây
            </p>
            {allConversationsQuery.isLoading ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : allConversationsQuery.isError ? (
              <div className="text-center py-10 text-muted-foreground">
                <p className="text-sm">
                  Khong the tai danh sach cuoc tro chuyen.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {recentChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => router.push(`/ai-assistant/${chat.id}`)}
                    className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground group-hover:text-primary transition-colors truncate">
                        {chat.title || "Cuoc tro chuyen"}
                      </p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {formatDate(chat)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
