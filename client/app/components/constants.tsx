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
    label: "Tổng quan",
    icon: <LuLayoutDashboard />,
    href: "overview",
  },
  {
    label: "Hồ sơ đến",
    icon: <LuInbox />,
    href: "incoming",
  },
  {
    label: "Thư viện",
    icon: <LuBookOpen />,
    href: "library",
  },
  {
    label: "Trợ lý AI",
    icon: <LuBot />,
    href: "ai-assistant",
  },
  {
    label: "Tìm kiếm đoạn chat",
    icon: <LuSearch />,
    href: "smart-search",
  },
  {
    label: "Phân tích",
    icon: <LuChartColumn />,
    href: "analytics",
  },
  {
    label: "Bảo mật & nhật ký",
    icon: <LuShield />,
    href: "security",
  },
];
