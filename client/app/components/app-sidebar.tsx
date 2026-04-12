import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SIDEBAR_ITEMS } from "./constants";
import { SideMain } from "./side-main";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader></SidebarHeader>

      <SidebarContent>
        <SideMain items={SIDEBAR_ITEMS} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
