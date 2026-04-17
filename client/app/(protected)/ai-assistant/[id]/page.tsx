"use client";
import { documents } from "@/data/mock-data";
import { libraryDocuments } from "@/data/library-data";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  Bot,
  Send,
  Paperclip,
  User,
  X,
  FileText,
  Search,
  BookOpen,
  Inbox,
  Upload,
  File,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { $api } from "@/lib/api/api";
import { components } from "@/lib/api/v1";

type AttachmentItem = {
  source: "workflow" | "library" | "local";
  id: string;
  code: string;
  title: string;
  meta?: Record<string, string>;
};

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  attachments?: AttachmentItem[];
  citations?: string[];
}

const defaultSuggestions = [
  "Hướng dẫn quy trình xử lý hồ sơ",
  "So sánh hai văn bản pháp quy",
  "Phân tích rủi ro văn bản",
];

export default function AIChat() {
  const params = useParams<{ id: string }>();
  const conversationId = params?.id;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prefillSource = searchParams.get("source") as
    | "workflow"
    | "library"
    | null;
  const prefillId = searchParams.get("docId");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [composerAttachments, setComposerAttachments] = useState<
    AttachmentItem[]
  >([]);
  const [showDocPicker, setShowDocPicker] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const conversationQuery = $api.useQuery(
    "get",
    "/api/chats/conversations/{id}/",
    {
      params: {
        path: {
          id: conversationId,
        },
      },
    },
    {
      enabled: Boolean(conversationId),
      refetchOnWindowFocus: false,
    },
  );

  const { mutateAsync: sendMessage, isPending: isSending } = $api.useMutation(
    "post",
    "/api/chats/conversations/{conversation_id}/chat",
  );

  const mapApiMessage = (
    message: components["schemas"]["Message"],
  ): ChatMessage => ({
    id: String(message.id),
    role:
      message.role === "assistant"
        ? "assistant"
        : message.role === "system"
          ? "system"
          : "user",
    content: message.content,
  });

  // Handle deep-link from document detail pages.
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (prefillSource && prefillId) {
      let att: AttachmentItem | null = null;
      if (prefillSource === "workflow") {
        const doc = documents.find((d) => d.id === prefillId);
        if (doc)
          att = {
            source: "workflow",
            id: doc.id,
            code: doc.code,
            title: doc.title,
            meta: { Loại: doc.type, Hạn: doc.deadline },
          };
      } else if (prefillSource === "library") {
        const doc = libraryDocuments.find((d) => d.id === prefillId);
        if (doc)
          att = {
            source: "library",
            id: doc.id,
            code: doc.code,
            title: doc.title,
            meta: { Loại: doc.type, "Cơ quan": doc.issuingAgency },
          };
      }
      if (att) {
        setComposerAttachments([att]);
      }
      const updatedParams = new URLSearchParams(searchParams.toString());
      updatedParams.delete("source");
      updatedParams.delete("docId");
      const nextQuery = updatedParams.toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    }
  }, [pathname, prefillId, prefillSource, router, searchParams]);

  // Keep local messages in sync with backend conversation.
  useEffect(() => {
    if (!conversationQuery.data) return;
    const apiMessages = conversationQuery.data.messages.map(mapApiMessage);
    if (apiMessages.length > 0) {
      setMessages(apiMessages);
      return;
    }

    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Xin chào! Tôi là trợ lý AI của hệ thống Government Flow. Bạn có thể đính kèm văn bản vào từng tin nhắn hoặc hỏi câu hỏi chung.",
      },
    ]);
  }, [conversationQuery.data]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleAttachFromPicker = (
    source: "workflow" | "library",
    id: string,
  ) => {
    let att: AttachmentItem | null = null;
    if (source === "workflow") {
      const doc = documents.find((d) => d.id === id);
      if (doc)
        att = {
          source: "workflow",
          id: doc.id,
          code: doc.code,
          title: doc.title,
        };
    } else {
      const doc = libraryDocuments.find((d) => d.id === id);
      if (doc)
        att = {
          source: "library",
          id: doc.id,
          code: doc.code,
          title: doc.title,
        };
    }
    if (att && !composerAttachments.find((a) => a.id === att!.id)) {
      setComposerAttachments((prev) => [...prev, att!]);
    }
    setShowDocPicker(false);
  };

  const handleLocalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const att: AttachmentItem = {
      source: "local",
      id: `local-${Date.now()}`,
      code: file.name,
      title: file.name,
      meta: { "Kích thước": `${(file.size / 1024).toFixed(0)} KB` },
    };
    setComposerAttachments((prev) => [...prev, att]);
    e.target.value = "";
  };

  const removeComposerAttachment = (id: string) => {
    setComposerAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const buildApiContent = (rawInput: string, attachments: AttachmentItem[]) => {
    const trimmedInput = rawInput.trim();
    const attachmentLines = attachments.map((att) => {
      const sourceLabel =
        att.source === "workflow"
          ? "Ho so"
          : att.source === "library"
            ? "Thu vien"
            : "Tep local";
      return `- [${sourceLabel}] ${att.code}: ${att.title}`;
    });

    if (attachmentLines.length === 0) return trimmedInput;

    const prefix =
      trimmedInput.length > 0
        ? trimmedInput
        : "Vui long phan tich cac tai lieu dinh kem.";
    return `${prefix}\n\nTai lieu dinh kem:\n${attachmentLines.join("\n")}`;
  };

  const handleSend = async () => {
    if (!input.trim() && composerAttachments.length === 0) return;

    if (!conversationId) {
      setSendError("Khong tim thay cuoc tro chuyen.");
      return;
    }

    setSendError(null);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      attachments:
        composerAttachments.length > 0 ? [...composerAttachments] : undefined,
    };

    const payloadContent = buildApiContent(input, composerAttachments);
    const previousMessages = messages;

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setComposerAttachments([]);

    try {
      await sendMessage({
        params: {
          path: {
            conversation_id: conversationId,
          },
        },
        body: {
          content: payloadContent,
        },
      });
      await conversationQuery.refetch();
    } catch {
      setMessages(previousMessages);
      setSendError("Khong gui duoc tin nhan. Vui long thu lai.");
    }
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-56px)] animate-fade-in">
        {/* Messages */}
        <div className="flex-1 overflow-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="max-w-[700px] mx-auto space-y-6">
            {conversationQuery.isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Dang tai cuoc tro
                chuyen...
              </div>
            )}

            {conversationQuery.isError && (
              <div className="text-sm text-destructive">
                Khong tai duoc lich su tro chuyen.
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role !== "user" && (
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5"
                      : "text-foreground"
                  }`}
                >
                  {/* Per-message attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div
                      className={`flex flex-wrap gap-1.5 mb-2 ${msg.role === "user" ? "" : ""}`}
                    >
                      {msg.attachments.map((att) => (
                        <span
                          key={att.id}
                          className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-lg ${
                            msg.role === "user"
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-primary/5 border border-primary/20 text-primary"
                          }`}
                        >
                          {att.source === "local" ? (
                            <File className="h-3 w-3" />
                          ) : (
                            <FileText className="h-3 w-3" />
                          )}
                          <span className="font-mono">{att.code}</span>
                          {att.source !== "local" && (
                            <span
                              className={`text-[9px] px-1 py-0.5 rounded ${
                                msg.role === "user"
                                  ? "bg-primary-foreground/10"
                                  : "bg-primary/10"
                              }`}
                            >
                              {att.source === "library" ? "Thư viện" : "Hồ sơ"}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  {msg.citations && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {msg.citations.map((c, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
                        >
                          📎 {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isSending && (
              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Dang tra
                  loi...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 sm:px-6 pb-2">
            <div className="max-w-[700px] mx-auto flex flex-wrap gap-2">
              {defaultSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-border/60 bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Composer */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
          <div className="max-w-[700px] mx-auto">
            {/* Composer attachment chips */}
            {composerAttachments.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {composerAttachments.map((att) => (
                  <span
                    key={att.id}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-primary/5 border border-primary/20 text-foreground"
                  >
                    {att.source === "local" ? (
                      <File className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <FileText className="h-3 w-3 text-primary" />
                    )}
                    <span className="font-mono text-[10px] text-primary">
                      {att.code}
                    </span>
                    {att.source !== "local" && (
                      <span className="text-[9px] px-1 py-0.5 rounded bg-primary/10 text-primary">
                        {att.source === "library" ? "Thư viện" : "Hồ sơ"}
                      </span>
                    )}
                    <button
                      onClick={() => removeComposerAttachment(att.id)}
                      className="text-muted-foreground hover:text-foreground ml-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2 bg-card rounded-xl border border-border/60 shadow-card p-2">
              {/* Attach menu */}
              <AttachMenu
                onPickDoc={() => setShowDocPicker(true)}
                onPickLocal={() => fileInputRef.current?.click()}
              />
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleLocalFile}
              />

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Nhập tin nhắn..."
                className="flex-1 h-9 px-2 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
              />
              <button
                onClick={handleSend}
                disabled={
                  isSending ||
                  (!input.trim() && composerAttachments.length === 0)
                }
                className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition disabled:opacity-40 flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            {sendError && (
              <p className="mt-2 text-xs text-destructive">{sendError}</p>
            )}
          </div>
        </div>
      </div>

      <DocumentPickerDialog
        open={showDocPicker}
        onClose={() => setShowDocPicker(false)}
        onSelect={handleAttachFromPicker}
        currentIds={composerAttachments.map((a) => a.id)}
      />
    </>
  );
}

function AttachMenu({
  onPickDoc,
  onPickLocal,
}: {
  onPickDoc: () => void;
  onPickLocal: () => void;
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
        onClick={() => setOpen(!open)}
        className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
      >
        <Paperclip className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute left-0 bottom-11 z-50 w-52 bg-popover rounded-xl border border-border shadow-lg py-1.5 animate-fade-in">
          <button
            onClick={() => {
              setOpen(false);
              onPickDoc();
            }}
            className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2.5 transition-colors"
          >
            <Inbox className="h-4 w-4 text-muted-foreground" />
            Chọn từ hồ sơ / thư viện
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onPickLocal();
            }}
            className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2.5 transition-colors"
          >
            <Upload className="h-4 w-4 text-muted-foreground" />
            Tải tệp từ máy tính
          </button>
        </div>
      )}
    </div>
  );
}

function DocumentPickerDialog({
  open,
  onClose,
  onSelect,
  currentIds,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (source: "workflow" | "library", id: string) => void;
  currentIds: string[];
}) {
  const [tab, setTab] = useState<"workflow" | "library">("workflow");
  const [search, setSearch] = useState("");

  const workflowFiltered = useMemo(
    () =>
      documents.filter(
        (d) =>
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.code.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );
  const libraryFiltered = useMemo(
    () =>
      libraryDocuments.filter(
        (d) =>
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.code.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[520px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base">Chọn văn bản đính kèm</DialogTitle>
        </DialogHeader>
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setTab("workflow")}
            className={`flex-1 h-8 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
              tab === "workflow"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Inbox className="h-3.5 w-3.5" /> Hồ sơ đến
          </button>
          <button
            onClick={() => setTab("library")}
            className={`flex-1 h-8 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
              tab === "library"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" /> Thư viện
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã hoặc tiêu đề..."
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-border/60 bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
        <div className="flex-1 overflow-auto space-y-1 max-h-[400px] min-h-[200px]">
          {tab === "workflow" ? (
            workflowFiltered.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                Không tìm thấy hồ sơ.
              </p>
            ) : (
              workflowFiltered.map((d) => (
                <button
                  key={d.id}
                  onClick={() => onSelect("workflow", d.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentIds.includes(d.id)
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono text-primary">
                      {d.code}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      Hồ sơ
                    </span>
                  </div>
                  <p className="text-sm text-foreground line-clamp-1">
                    {d.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {d.sender} · {d.receivedDate}
                  </p>
                </button>
              ))
            )
          ) : libraryFiltered.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">
              Không tìm thấy văn bản.
            </p>
          ) : (
            libraryFiltered.map((d) => (
              <button
                key={d.id}
                onClick={() => onSelect("library", d.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  currentIds.includes(d.id)
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-mono text-primary">
                    {d.code}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                    Thư viện
                  </span>
                </div>
                <p className="text-sm text-foreground line-clamp-1">
                  {d.title}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {d.issuingAgency} · {d.type}
                </p>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
