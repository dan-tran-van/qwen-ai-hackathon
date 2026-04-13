"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/providers/auth-provider";
import { usePathname } from "next/navigation";
import { LuBell, LuUser } from "react-icons/lu";
import { SIDEBAR_ITEMS } from "./constants";
import Link from "next/link";

export function SidebarContentHeader() {
  const { user, logout } = useAuth();

  const pathname = usePathname();
  const currentTab = pathname.split("/")[1];
  const tabLabel = SIDEBAR_ITEMS.find(
    (item) => item.href === currentTab,
  )?.label;

  return (
    <header className="h-14 flex items-center justify-between border-b border-border/60 px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <h6 className="text-md font-semibold text-foreground">{tabLabel}</h6>
      </div>
      <div className="flex items-center gap-2">
        <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
          <LuBell size={24} className="h-4 w-4" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary cursor-pointer">
              <LuUser size={24} className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-sm">
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={"/profile"}>Profile</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={"/settings"}>Settings</Link>
              </DropdownMenuItem>
              {user && (
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  Logout
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
