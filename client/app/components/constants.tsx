import {
  LuBot,
  LuChartColumn,
  LuFileText,
  LuGitBranch,
  LuInbox,
  LuLayoutDashboard,
  LuSearch,
  LuShield,
} from "react-icons/lu";

export type SidebarItem = {
  label: string;
  icon?: React.ReactNode;
  href?: string;
};

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: "Overview",
    icon: <LuLayoutDashboard />,
    href: "overview",
  },
  {
    label: "Incoming Records",
    icon: <LuInbox />,
    href: "incoming-records",
  },
  {
    label: "Documents",
    icon: <LuFileText />,
    href: "documents",
  },
  {
    label: "Process Tracking",
    icon: <LuGitBranch />,
    href: "process-tracking",
  },
  {
    label: "Search",
    icon: <LuSearch />,
    href: "smart-search",
  },
  {
    label: "AI Assistant",
    icon: <LuBot />,
    href: "ai-assistant",
  },
  {
    label: "Analytics",
    icon: <LuChartColumn />,
    href: "analytics",
  },
  {
    label: "Security & Logs",
    icon: <LuShield />,
    href: "security",
  },
];
