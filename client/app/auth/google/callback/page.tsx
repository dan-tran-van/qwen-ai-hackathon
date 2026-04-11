"use client";
import { $api } from "@/lib/api/api";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { data, isLoading, error } = $api.useQuery(
    "post",
    "/api/auth/google/",
    { body: { code: code || "" } },
  );

  useEffect(() => {
    if (data) {
      redirect("/dashboard");
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.detail}</div>;
  return <div>Redirecting...</div>;
}
