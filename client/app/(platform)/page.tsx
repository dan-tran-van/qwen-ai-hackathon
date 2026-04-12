"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { $api } from "@/lib/api/api";
import { useAuth } from "@/providers/auth-provider";
import { useEffect } from "react";

export default function HomePage() {
  const { user } = useAuth();
  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, [user]);

  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4"></div>
    </>
  );
}
