"use client";
import { $api } from "@/lib/api/api";
import { useSearchParams } from "next/navigation";

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { data, isLoading, error } = $api.useQuery(
    "post",
    "/api/auth/google/",
    { body: { code: code || "" } },
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.detail}</div>;
  console.log("Google callback data:", data);

  return (
    <div>
      {data ? (
        <div>
          <h1>Login successful!</h1>
          <p>Welcome, {data.access}!</p>
        </div>
      ) : (
        <div>Logging in...</div>
      )}
    </div>
  );
}
