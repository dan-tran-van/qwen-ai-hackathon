"use client";
import { documents } from "@/data/mock-data";
import { libraryDocuments } from "@/data/library-data";
import { useState, useEffect, useMemo } from "react";
import {
  Bot,
  Send,
  Upload,
  Paperclip,
  User,
  Sparkles,
  X,
  FileText,
  PanelRightOpen,
  PanelRightClose,
  Plus,
  Search,
  BookOpen,
  Inbox,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: string[];
}

type AttachedDoc = {
  source: "workflow" | "library";
  id: string;
  code: string;
  title: string;
  meta: Record<string, string>;
} | null;

const defaultSuggestions = [
  "Tóm tắt văn bản này",
  "Hạn xử lý là khi nào?",
  "Phòng ban nào phụ trách?",
  "Có rủi ro gì không?",
  "Văn bản liên quan?",
];
const librarySuggestions = [
  "Tóm tắt văn bản này",
  "Văn bản này áp dụng cho trường hợp nào?",
  "Những yêu cầu chính là gì?",
  "Có thời hạn hay mốc quan trọng nào không?",
  "So sánh với văn bản liên quan",
];
const emptySuggestions = [
  "Hướng dẫn quy trình xử lý hồ sơ",
  "So sánh hai văn bản pháp quy",
  "Phân tích rủi ro văn bản",
];

export default function AIChat() {
  const searchParams = useSearchParams();
  const libraryDocId = searchParams.get("libraryDoc");
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [attachedDoc, setAttachedDoc] = useState<AttachedDoc>(null);
  const [showDocPicker, setShowDocPicker] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  // Handle deep-link from library
  useEffect(() => {
    if (libraryDocId) {
      const libDoc = libraryDocuments.find((d) => d.id === libraryDocId);
      if (libDoc) {
        setAttachedDoc({
          source: "library",
          id: libDoc.id,
          code: libDoc.code,
          title: libDoc.title,
          meta: {
            Loại: libDoc.type,
            "Cơ quan": libDoc.issuingAgency,
            "Hiệu lực": libDoc.effectiveDate,
            "Bảo mật": libDoc.confidentiality,
            "Trạng thái": libDoc.status,
          },
        });
        setMessages([
          {
            id: "lib-intro",
            role: "assistant",
            content: `Đã chọn văn bản **${libDoc.code}** – "${libDoc.title}" từ thư viện.\n\nTôi đã đọc và phân tích nội dung văn bản này. Bạn có thể hỏi bất kỳ câu hỏi nào về nội dung, phạm vi áp dụng, yêu cầu, thời hạn, hoặc so sánh với các văn bản liên quan.`,
          },
        ]);
      }
    }
  }, [libraryDocId]);

  // Default empty state
  useEffect(() => {
    if (!libraryDocId) {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content:
            "Xin chào! Tôi là trợ lý AI của hệ thống Government Flow. Bạn có thể đính kèm văn bản từ hồ sơ đến hoặc thư viện để tôi hỗ trợ phân tích, hoặc hỏi câu hỏi chung.",
        },
      ]);
    }
  }, []);

  const suggestions = attachedDoc
    ? attachedDoc.source === "library"
      ? librarySuggestions
      : defaultSuggestions
    : emptySuggestions;

  const handleAttach = (source: "workflow" | "library", id: string) => {
    if (source === "workflow") {
      const doc = documents.find((d) => d.id === id);
      if (!doc) return;
      setAttachedDoc({
        source: "workflow",
        id: doc.id,
        code: doc.code,
        title: doc.title,
        meta: {
          Loại: doc.type,
          Hạn: doc.deadline,
          "Bảo mật": doc.confidentiality,
          "Phòng ban": doc.suggestedDept,
        },
      });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `Đã đính kèm hồ sơ **${doc.code}** – "${doc.title}". Bạn có thể hỏi bất kỳ câu hỏi nào.`,
        },
      ]);
    } else {
      const doc = libraryDocuments.find((d) => d.id === id);
      if (!doc) return;
      setAttachedDoc({
        source: "library",
        id: doc.id,
        code: doc.code,
        title: doc.title,
        meta: {
          Loại: doc.type,
          "Cơ quan": doc.issuingAgency,
          "Hiệu lực": doc.effectiveDate,
          "Bảo mật": doc.confidentiality,
        },
      });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `Đã đính kèm văn bản thư viện **${doc.code}** – "${doc.title}". Bạn có thể hỏi bất kỳ câu hỏi nào.`,
        },
      ]);
    }
    setShowDocPicker(false);
    // Clear URL param if switching
    if (searchParams.has("libraryDoc")) {
      router.push("/ai-assistant");
    }
  };

  const handleDetach = () => {
    setAttachedDoc(null);
    if (searchParams.has("libraryDoc")) {
      router.push("/ai-assistant");
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    let aiContent: string;
    if (attachedDoc?.source === "workflow") {
      const doc = documents.find((d) => d.id === attachedDoc.id);
      aiContent = doc ? getMockResponse(input, doc) : "Không tìm thấy văn bản.";
    } else if (attachedDoc?.source === "library") {
      const doc = libraryDocuments.find((d) => d.id === attachedDoc.id);
      aiContent = doc
        ? getMockLibraryResponse(input, doc)
        : "Không tìm thấy văn bản.";
    } else {
      aiContent = `Cảm ơn câu hỏi! Để tôi hỗ trợ chính xác hơn, bạn có thể đính kèm một văn bản cụ thể từ hồ sơ đến hoặc thư viện.\n\nTôi vẫn có thể trả lời câu hỏi chung về quy trình hành chính và xử lý văn bản.`;
    }
    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiContent,
      citations: attachedDoc
        ? attachedDoc.source === "library"
          ? ["Điều 1, khoản 1", "Chương II, mục 3"]
          : ["Trang 1, đoạn 3", "Điều 5, khoản 2"]
        : undefined,
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-56px)] animate-fade-in">
        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Attached doc chip */}
          <div className="px-4 sm:px-6 pt-4">
            <div className="max-w-[700px] mx-auto">
              {attachedDoc ? (
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 max-w-full">
                  <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="text-xs min-w-0 flex items-center gap-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                      {attachedDoc.source === "library" ? "Thư viện" : "Hồ sơ"}
                    </span>
                    <span className="font-mono text-primary">
                      {attachedDoc.code}
                    </span>
                    <span className="text-muted-foreground truncate hidden sm:inline">
                      {attachedDoc.title}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowDocPicker(true)}
                    className="text-[10px] text-primary hover:underline ml-1 flex-shrink-0"
                  >
                    Đổi
                  </button>
                  <button
                    onClick={handleDetach}
                    className="ml-1 text-muted-foreground hover:text-foreground flex-shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDocPicker(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-border/60 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Đính kèm văn bản
                </button>
              )}
            </div>
          </div>

          {/* Toggle panel button on mobile/tablet */}
          {attachedDoc && (
            <div className="lg:hidden flex justify-end px-4 pt-2">
              <button
                onClick={() => setShowPanel(!showPanel)}
                className="h-8 px-3 rounded-lg border border-border/60 bg-card text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
              >
                {showPanel ? (
                  <PanelRightClose className="h-3.5 w-3.5" />
                ) : (
                  <PanelRightOpen className="h-3.5 w-3.5" />
                )}
                {showPanel ? "Ẩn" : "Chi tiết"}
              </button>
            </div>
          )}

          {/* Mobile panel */}
          {showPanel && attachedDoc && (
            <div className="lg:hidden px-4 pt-2">
              <div className="bg-card rounded-xl border border-border/40 p-3 mb-2">
                <span className="text-[10px] font-mono text-primary">
                  {attachedDoc.code}
                </span>
                <p className="text-xs font-medium text-foreground mt-0.5">
                  {attachedDoc.title}
                </p>
                <div className="space-y-1 mt-2 text-[10px]">
                  {Object.entries(attachedDoc.meta).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="text-foreground">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="max-w-[700px] mx-auto space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {msg.role === "assistant" && (
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
            </div>
          </div>

          {/* Suggestions */}
          <div className="px-4 sm:px-6 pb-2">
            <div className="max-w-[700px] mx-auto flex flex-wrap gap-2">
              {suggestions.map((s) => (
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

          {/* Input */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
            <div className="max-w-[700px] mx-auto">
              <div className="flex items-end gap-2 bg-card rounded-xl border border-border/60 shadow-card p-2">
                <button
                  onClick={() => setShowDocPicker(true)}
                  className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  placeholder={
                    attachedDoc
                      ? `Hỏi về ${attachedDoc.code}...`
                      : "Hỏi câu hỏi hoặc đính kèm văn bản..."
                  }
                  className="flex-1 h-9 px-2 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition disabled:opacity-40 flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Right panel */}
        {attachedDoc && (
          <div className="hidden lg:flex w-[320px] border-l border-border/40 bg-card/30 flex-col">
            <div className="p-4 border-b border-border/40">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  {attachedDoc.source === "library"
                    ? "Văn bản thư viện"
                    : "Hồ sơ đến"}
                </h4>
                <button
                  onClick={() => setShowDocPicker(true)}
                  className="text-xs text-primary hover:underline"
                >
                  Đổi
                </button>
              </div>
              <div className="bg-card rounded-lg border border-border/40 p-3">
                <span className="text-[10px] font-mono text-primary">
                  {attachedDoc.code}
                </span>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  {attachedDoc.title}
                </p>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              <div>
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Metadata
                </h4>
                <div className="space-y-1.5 text-xs">
                  {Object.entries(attachedDoc.meta).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="text-foreground">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Document Picker Dialog */}
      <DocumentPickerDialog
        open={showDocPicker}
        onClose={() => setShowDocPicker(false)}
        onSelect={handleAttach}
        currentId={attachedDoc?.id}
      />
    </>
  );
}

function DocumentPickerDialog({
  open,
  onClose,
  onSelect,
  currentId,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (source: "workflow" | "library", id: string) => void;
  currentId?: string;
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

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setTab("workflow")}
            className={`flex-1 h-8 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
              tab === "workflow"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Inbox className="h-3.5 w-3.5" />
            Hồ sơ đến
          </button>
          <button
            onClick={() => setTab("library")}
            className={`flex-1 h-8 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
              tab === "library"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Thư viện
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã hoặc tiêu đề..."
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-border/60 bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>

        {/* List */}
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
                    d.id === currentId
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
                  d.id === currentId
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

function getMockResponse(input: string, doc: (typeof documents)[0]): string {
  const lower = input.toLowerCase();
  if (lower.includes("tóm tắt") || lower.includes("summary")) {
    return `**Tóm tắt văn bản ${doc.code}:**\n\n${doc.summary}\n\n**Chủ đề chính:** ${doc.subject}\n**Thực thể:** ${doc.entities.join(", ")}`;
  }
  if (lower.includes("hạn") || lower.includes("deadline")) {
    return `Hạn xử lý của văn bản **${doc.code}** là **${doc.deadline}**.\n\nVăn bản này thuộc loại "${doc.type}" và cần được xử lý bởi **${doc.suggestedDept}**.`;
  }
  if (lower.includes("phòng ban") || lower.includes("department")) {
    return `AI đề xuất chuyển văn bản **${doc.code}** đến **${doc.suggestedDept}**.\n\nNgười xử lý đề xuất: **${doc.suggestedReviewer}** (Confidence: ${Math.round(doc.aiConfidence * 100)}%)`;
  }
  if (lower.includes("rủi ro") || lower.includes("risk")) {
    if (doc.riskFlags.length === 0)
      return `Không phát hiện rủi ro đáng kể cho văn bản **${doc.code}**.`;
    return `⚠️ **Cảnh báo rủi ro cho ${doc.code}:**\n\n${doc.riskFlags.map((f) => `• ${f}`).join("\n")}\n\nĐề xuất: Xem xét kỹ trước khi phê duyệt.`;
  }
  if (lower.includes("liên quan") || lower.includes("related")) {
    if (doc.relatedDocs.length === 0)
      return "Không tìm thấy văn bản liên quan trong hệ thống.";
    return `Các văn bản liên quan đến **${doc.code}**:\n\n${doc.relatedDocs.map((r) => `• **${r}** – Cùng chủ đề "${doc.subject}"`).join("\n")}`;
  }
  return `Đã phân tích văn bản **${doc.code}** – "${doc.title}".\n\nBạn có thể hỏi tôi về tóm tắt, hạn xử lý, phòng ban phụ trách, rủi ro, hoặc văn bản liên quan.`;
}

function getMockLibraryResponse(
  input: string,
  doc: {
    code: string;
    title: string;
    summary: string;
    type: string;
    issuingAgency: string;
    effectiveDate: string;
    tags: string[];
    relatedDocs: string[];
    content: string;
  },
): string {
  const lower = input.toLowerCase();
  if (lower.includes("tóm tắt") || lower.includes("summary")) {
    return `**Tóm tắt ${doc.code}:**\n\n${doc.summary}\n\n**Loại:** ${doc.type}\n**Cơ quan:** ${doc.issuingAgency}`;
  }
  if (lower.includes("áp dụng") || lower.includes("trường hợp")) {
    return `Văn bản **${doc.code}** áp dụng cho các tổ chức, cá nhân thuộc phạm vi quản lý của **${doc.issuingAgency}**.\n\nLoại: ${doc.type}\nTừ khóa: ${doc.tags.join(", ")}`;
  }
  if (lower.includes("yêu cầu") || lower.includes("chính")) {
    return `**Những yêu cầu chính của ${doc.code}:**\n\nDựa trên nội dung văn bản, các yêu cầu chính bao gồm:\n• Tuân thủ quy định tại văn bản\n• Thực hiện đúng thời hạn quy định\n• Báo cáo kết quả thực hiện về cơ quan ban hành`;
  }
  if (lower.includes("thời hạn") || lower.includes("mốc")) {
    return `**Các mốc thời gian quan trọng:**\n\n• Ngày có hiệu lực: **${doc.effectiveDate}**\n• Các mốc cụ thể được nêu trong nội dung văn bản`;
  }
  if (lower.includes("so sánh") || lower.includes("liên quan")) {
    if (doc.relatedDocs.length === 0)
      return "Không tìm thấy văn bản liên quan trong thư viện.";
    return `**Văn bản liên quan đến ${doc.code}:**\n\n${doc.relatedDocs.map((r) => `• **${r}**`).join("\n")}\n\nCác văn bản này có nội dung bổ sung hoặc hướng dẫn chi tiết cho ${doc.code}.`;
  }
  return `Đã phân tích văn bản **${doc.code}** – "${doc.title}" từ thư viện.\n\nBạn có thể hỏi về tóm tắt, phạm vi áp dụng, yêu cầu chính, thời hạn, hoặc so sánh với văn bản liên quan.`;
}
