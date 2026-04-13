import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { SidebarContentHeader } from "../components/sidebar-content-header";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <TooltipProvider>
          <AppSidebar />
          <SidebarInset>
            <SidebarContentHeader />
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
              {children}
            </main>
          </SidebarInset>
        </TooltipProvider>
      </SidebarProvider>
    </>
  );
}
