import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ReactQueryProvider from "@/providers/react-query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import AuthProvider from "@/providers/auth-provider";
import { ActiveTabProvider, useActiveTab } from "@/providers/sidebar-provider";
import { SidebarContentHeader } from "./components/sidebar-content-header";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Goverment Flow AI",
  description: "Goverment Flow AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="h-screen w-screen">
        <ActiveTabProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <SidebarContentHeader />
              <div className="flex-1 overflow-auto p-4">
                <TooltipProvider>
                  <ReactQueryProvider>
                    <AuthProvider>{children}</AuthProvider>
                  </ReactQueryProvider>
                </TooltipProvider>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </ActiveTabProvider>
      </body>
    </html>
  );
}
