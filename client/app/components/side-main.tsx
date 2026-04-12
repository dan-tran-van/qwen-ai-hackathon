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
import { TooltipProvider } from "@/components/ui/tooltip";

export function SideMain({ items }: { items: SidebarItem[] }) {
  const { isActive } = useActiveTab();

  return (
    <TooltipProvider>
      <SidebarGroup>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href || "")}
                tooltip={item.label}
              >
                <Link href={`/${item.href}`}>
                  {item.icon}
                  <p>{item.label}</p>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </TooltipProvider>
  );
}
