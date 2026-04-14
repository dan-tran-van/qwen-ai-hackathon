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
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-secondary-background">
              {children}
            </div>
          </SidebarInset>
        </TooltipProvider>
      </SidebarProvider>
    </>
  );
}
