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

  return <></>;
}
