import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Clock,
  Star,
  Tag,
  Trash2,
  Server,
  HardDrive,
  Activity,
} from "lucide-react";

export const mainNavItems = [
  { label: "My Drive", href: "/files", icon: FolderOpen },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Activity Log", href: "/activity", icon: Activity },
  { label: "Recent", href: "/recent", icon: Clock },
  { label: "Favorites", href: "/favorites", icon: Star },
  { label: "Tags", href: "/tags", icon: Tag },
  { label: "Trash", href: "/trash", icon: Trash2 },
];

export const adminNavItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Servers", href: "/admin/servers", icon: Server },
  { label: "Storage", href: "/admin/storage", icon: HardDrive },
  { label: "Recent", href: "/admin/recent", icon: Clock },
];
