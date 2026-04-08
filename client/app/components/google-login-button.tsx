"use client";
import { Button } from "@/components/ui/button";

export default function GoogleLoginButton() {
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const REDIRECT_URI =
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ||
    "http://localhost:3000/auth/google/callback";
  const handleLogin = () => {
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "openid email profile");
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");

    window.location.href = authUrl.toString();
  };
  return (
    <Button variant="outline" className="w-full" onClick={handleLogin}>
      Login with Google
    </Button>
  );
}
