"use client";

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
