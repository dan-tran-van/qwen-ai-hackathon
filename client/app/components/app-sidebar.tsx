"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SIDEBAR_ITEMS } from "./constants";
import { SideMain } from "./side-main";
import { useAuth } from "@/providers/auth-provider";

export function AppSidebar() {
  const { user, logout } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <SideMain items={SIDEBAR_ITEMS} />
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <div className="flex flex-col items-start gap-2">
            <div className="text-sm font-medium">{user.email}</div>
            <button
              onClick={logout}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
