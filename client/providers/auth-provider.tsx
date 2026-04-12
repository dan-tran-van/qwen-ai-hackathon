"use client";
import { $api } from "@/lib/api/api";
import { components } from "@/lib/api/v1";
import Cookies from "js-cookie";
import { createContext, useContext } from "react";

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
  const { data, isLoading, error } = $api.useQuery("get", "/api/auth/user/");
  const logout = () => {
    Cookies.remove("access", { secure: true });
    Cookies.remove("refresh", { secure: true });
    window.location.href = "/";
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
