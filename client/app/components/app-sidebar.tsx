import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />

      <SidebarContent></SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
