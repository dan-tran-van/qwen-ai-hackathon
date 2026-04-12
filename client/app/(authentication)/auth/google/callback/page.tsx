"use client";
import { $api } from "@/lib/api/api";
import { useAuth } from "@/providers/auth-provider";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GoogleCallbackPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { data, isLoading, error } = $api.useQuery(
    "post",
    "/api/auth/google/",
    { body: { code: code || "" } },
    {
      enabled: !!code && !user, // Only run if we have a code and no user is logged in
    },
  );
  useEffect(() => {
    if (user) {
      redirect("/");
    }
  }, [user]);

  useEffect(() => {
    if (data) {
      redirect("/");
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.detail}</div>;
  return <div>Redirecting...</div>;
}
