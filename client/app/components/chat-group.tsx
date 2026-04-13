import { components } from "@/lib/api/v1";
import { MessageSquare } from "lucide-react";

type ChatConversation = components["schemas"]["Conversation"];

export function ChatGroup({
  label,
  chats,
  navigate,
  currentPath,
}: {
  label: string;
  chats: ChatConversation[];
  navigate: (path: string) => void;
  currentPath: string;
}) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground font-medium px-2 mb-1">
        {label}
      </p>
      <div className="space-y-0.5">
        {chats.map((chat) => {
          const isSelected = currentPath === `/ai-assistant/${chat.id}`;
          return (
            <button
              key={chat.id}
              onClick={() => navigate(`/ai-assistant/${chat.id}`)}
              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors group flex items-start gap-2 ${
                isSelected
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 opacity-50" />
              <span className="truncate leading-tight">{chat.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
