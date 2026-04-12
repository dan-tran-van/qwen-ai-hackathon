"use client";

import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { SIDEBAR_ITEMS } from "@/app/components/constants";

type SidebarContextType = {
  activeTab: string;
  isActive: (href: string) => boolean;
};

const SidebarContext = createContext<SidebarContextType>({
  activeTab: "",
  isActive: () => false,
});

export function ActiveTabProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeKey = pathname.split("/")[1] || "";

  // tìm item tương ứng
  const activeItem = SIDEBAR_ITEMS.find((item) => item.href === activeKey);

  const activeTab = activeItem?.label || "";

  const isActive = (href: string) => activeTab === href;

  return (
    <SidebarContext.Provider value={{ activeTab, isActive }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useActiveTab = () => useContext(SidebarContext);
