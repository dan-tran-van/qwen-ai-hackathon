import {
  LuBookOpen,
  LuBot,
  LuChartColumn,
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
    label: "Library",
    icon: <LuBookOpen />,
    href: "documents",
  },
  {
    label: "AI Assistant",
    icon: <LuBot />,
    href: "ai-assistant",
  },
  {
    label: "Search",
    icon: <LuSearch />,
    href: "smart-search",
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
