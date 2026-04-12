import ReactQueryProvider from "@/providers/react-query-provider";
import AuthProvider from "@/providers/auth-provider";

export default function AuthenticationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
