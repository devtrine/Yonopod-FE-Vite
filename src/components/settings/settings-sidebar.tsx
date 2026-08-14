import { Link, useLocation } from "react-router-dom";
import { User, Shield, HardDrive, Bell } from "lucide-react";

const SETTINGS_LINKS = [
  { href: "/settings/profile", label: "Profile", icon: User },
  { href: "/settings/security", label: "Security", icon: Shield },
  { href: "/settings/storage", label: "Storage", icon: HardDrive },
  { href: "/settings/notifications", label: "Notifications", icon: Bell },
];

export function SettingsSidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <aside className="w-64 bg-white border-r border-[#e2e8f0] p-6 flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider mb-2">
        Settings
      </h2>
      <nav className="flex flex-col gap-1">
        {SETTINGS_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={[
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#eff1fb] text-[#1c3fc4]"
                  : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]",
              ].join(" ")}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
