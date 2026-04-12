import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { SidebarContentHeader } from "../components/sidebar-content-header";

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SidebarContentHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
