"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { SidebarItem } from "./constants";
import { useActiveTab } from "@/providers/sidebar-provider";

export function SideMain({ items }: { items: SidebarItem[] }) {
  const { isActive } = useActiveTab();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton asChild isActive={isActive(item.href || "")}>
              <Link href={`/${item.href}`}>
                {item.icon}
                <p>{item.label}</p>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
