"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { SidebarItem } from "./constants";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";

export function SideMain({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();
  const currentTab = pathname.split('/')[1];

  return (
    <TooltipProvider>
      <SidebarGroup>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={currentTab === item.href}
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
