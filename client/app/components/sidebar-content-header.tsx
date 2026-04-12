"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useActiveTab } from "@/providers/sidebar-provider";
import { LuBell, LuUser } from "react-icons/lu";

export function SidebarContentHeader() {
  const { activeTab } = useActiveTab();

  return (
    <header className="h-14 flex items-center justify-between border-b border-border/60 px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <h6 className="text-sm font-semibold text-foreground">{activeTab}</h6>
      </div>
      <div className="flex items-center gap-2">
        <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
          <LuBell size={24} className="h-4 w-4" />
        </button>
        <button className="h-8 w-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary cursor-pointer">
          <LuUser size={24} className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
