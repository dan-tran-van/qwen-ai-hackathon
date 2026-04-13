"use client";
import { $api, fetchClient } from "@/lib/api/api";
import { components } from "@/lib/api/v1";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";

type UserDetails = components["schemas"]["UserDetails"];

type AuthContextProps = {
  user: UserDetails | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextProps>({
  user: null,
  logout: () => {},
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = $api.useQuery("get", "/api/auth/user/");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    setIsLoggingOut(true);
    await fetchClient.POST("/api/auth/logout/", {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
    });

    queryClient.clear();
    setIsLoggingOut(false);
    window.location.href = "/login";
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user: data || null,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
