"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { SIDEBAR_ITEMS } from "./constants";
import { SideMain } from "./side-main";
import { useAuth } from "@/providers/auth-provider";
import Image from "next/image";
import { PlusIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        {/* Logo */}
        <div className={`px-4 pb-4 ${collapsed ? "px-2" : ""}`}>
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            {!collapsed && (
              <div>
                <h1 className="text-sm font-semibold text-foreground tracking-tight">
                  Government Flow
                </h1>
                <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
                  AI Platform
                </p>
              </div>
            )}
          </div>
        </div>
        <SideMain items={SIDEBAR_ITEMS} />
        {/* Chat conversations */}
        {!collapsed && (
          <div className="flex-1 flex flex-col min-h-0 mt-2">
            <div className="px-4 mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Cuộc trò chuyện
              </span>
              <button
                // onClick={() => navigate("/ai-chat")}
                className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
                title="Cuộc trò chuyện mới"
              >
                <PlusIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            <ScrollArea className="flex-1 px-2">
              <div className="space-y-3 pb-4">
                {/* {grouped.today.length > 0 && (
                  <ChatGroup
                    label="Hôm nay"
                    chats={grouped.today}
                    navigate={navigate}
                    currentPath={location.pathname}
                  />
                )}
                {grouped.last7Days.length > 0 && (
                  <ChatGroup
                    label="7 ngày qua"
                    chats={grouped.last7Days}
                    navigate={navigate}
                    currentPath={location.pathname}
                  />
                )}
                {grouped.older.length > 0 && (
                  <ChatGroup
                    label="Cũ hơn"
                    chats={grouped.older}
                    navigate={navigate}
                    currentPath={location.pathname}
                  />
                )} */}
              </div>
            </ScrollArea>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
