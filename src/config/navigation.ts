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
} from "lucide-react";

export const mainNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Drive", href: "/files", icon: FolderOpen },
  { label: "Shared", href: "/shared", icon: Users },
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
