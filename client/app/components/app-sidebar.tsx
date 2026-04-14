"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SIDEBAR_ITEMS } from "./constants";
import { SideMain } from "./side-main";
import { useAuth } from "@/providers/auth-provider";
import Image from "next/image";
import {
  BarChart3,
  BookOpen,
  Bot,
  Inbox,
  LayoutDashboard,
  PlusIcon,
  Search,
  Shield,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { clsx } from "clsx";
import { $api } from "@/lib/api/api";
import { ChatGroup } from "./chat-group";
import { usePathname } from "next/dist/client/components/navigation";

const navItems = [
  { title: "Tổng quan", url: "/overview", icon: LayoutDashboard },
  { title: "Hồ sơ đến", url: "/incoming", icon: Inbox },
  { title: "Thư viện", url: "/library", icon: BookOpen },
  { title: "Trợ lý AI", url: "/ai-assistant", icon: Bot },
  { title: "Tìm kiếm đoạn chat", url: "/smart-search", icon: Search },
  { title: "Phân tích", url: "/analytics", icon: BarChart3 },
  { title: "Bảo mật & nhật ký", url: "/security", icon: Shield },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();
  const currentTab = pathname;

  const { data, isLoading, error } = $api.useQuery(
    "get",
    "/api/chats/conversations/today/",
  );
  const {
    data: last7DaysConversations,
    isLoading: is7DaysConversationLoading,
  } = $api.useQuery("get", "/api/chats/conversations/last-7-days/");

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
        {/* <SideMain items={SIDEBAR_ITEMS} /> */}
        {/* Main nav */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentTab === item.url}
                    tooltip={item.title}
                  >
                    <Link
                      href={item.url}
                      className={clsx(
                        "gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        {
                          "bg-sidebar-accent text-sidebar-accent-foreground":
                            currentTab === item.url,
                        },
                      )}
                    >
                      <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

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
                <PlusIcon className="h-3.5 w-3.5 cursor-pointer" />
              </button>
            </div>

            <ScrollArea className="flex-1 px-2">
              <div className="space-y-3 pb-4">
                {data && data.length > 0 && (
                  <ChatGroup
                    label="Hôm nay"
                    chats={data}
                    navigate={(path) => (location.href = path)}
                    currentPath={location.pathname}
                  />
                )}
                {last7DaysConversations &&
                  last7DaysConversations.length > 0 && (
                    <ChatGroup
                      label="7 ngày qua"
                      chats={last7DaysConversations}
                      navigate={(path) => (location.href = path)}
                      currentPath={location.pathname}
                    />
                  )}
                {/* {grouped.older.length > 0 && (
                  <ChatGroup
                    label="Cũ hơn"
                    chats={grouped.older}
                    navigate={navigate}
                    currentPath={location.pathname}
                  />
                )}  */}
              </div>
            </ScrollArea>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
