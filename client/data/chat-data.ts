export interface ChatConversation {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  documentCode?: string;
}

export const chatConversations: ChatConversation[] = [
  {
    id: "chat-1",
    title: "Phân tích CV-2026-0142",
    lastMessage:
      "Văn bản này yêu cầu cấp phép hoạt động cho Công ty TNHH ABC...",
    updatedAt: "2026-04-13T10:30:00",
    documentCode: "CV-2026-0142",
  },
  {
    id: "chat-2",
    title: "Tiến độ dự án Quận 3",
    lastMessage: "Tiến độ đạt 67%, dự kiến hoàn thành Q3/2026.",
    updatedAt: "2026-04-13T09:15:00",
    documentCode: "HS-2026-1188",
  },
  {
    id: "chat-3",
    title: "Quy hoạch đất 2026–2030",
    lastMessage: "Cần phản hồi trước ngày 20/04 theo yêu cầu liên sở.",
    updatedAt: "2026-04-12T16:40:00",
    documentCode: "UBND-QLHC-2026-52",
  },
  {
    id: "chat-4",
    title: "Hỏi về NĐ-01/2021",
    lastMessage: "Nghị định quy định chi tiết về đăng ký doanh nghiệp...",
    updatedAt: "2026-04-12T11:00:00",
    documentCode: "NĐ-01/2021/NĐ-CP",
  },
  {
    id: "chat-5",
    title: "Quy trình một cửa",
    lastMessage: "Các bước thực hiện theo cơ chế một cửa liên thông...",
    updatedAt: "2026-04-11T14:20:00",
  },
  {
    id: "chat-6",
    title: "So sánh biểu mẫu phiếu trình",
    lastMessage: "Mẫu BM-QLHC-01 được sử dụng cho phiếu trình lãnh đạo.",
    updatedAt: "2026-04-10T08:45:00",
  },
  {
    id: "chat-7",
    title: "Phân tích rủi ro hồ sơ tái định cư",
    lastMessage: "Có 2 cảnh báo: Hạn gấp và Nhạy cảm xã hội.",
    updatedAt: "2026-04-08T15:30:00",
    documentCode: "TT-2026-0081",
  },
  {
    id: "chat-8",
    title: "Chuyển đổi số cơ quan nhà nước",
    lastMessage: "Chỉ thị yêu cầu hoàn thành triển khai trước 31/12/2025.",
    updatedAt: "2026-04-06T10:00:00",
  },
];

export function groupConversationsByDate(conversations: ChatConversation[]) {
  const now = new Date("2026-04-13");
  const today: ChatConversation[] = [];
  const last7Days: ChatConversation[] = [];
  const older: ChatConversation[] = [];

  for (const c of conversations) {
    const date = new Date(c.updatedAt);
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 0) today.push(c);
    else if (diffDays <= 7) last7Days.push(c);
    else older.push(c);
  }

  return { today, last7Days, older };
}
