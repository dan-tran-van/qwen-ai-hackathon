"use client";

import { useAuth } from "@/providers/auth-provider";

export default function Overview() {
  const { user } = useAuth();
  console.log(user);
  return <div>Overview</div>;
}
