import { Link, useLocation } from "react-router-dom";
import {
  Settings,
  Plus,
  X,
} from "lucide-react";
import { ProgressBar } from "../ui/progress-bar";
import { useSidebar } from "./sidebar-context";
import { mainNavItems } from "@/config/navigation";
import { useCurrentUser } from "../../hooks/use-auth";
import { formatFileSize } from "@/lib/formatters";

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { isOpen, setIsOpen } = useSidebar();
  const { data: user } = useCurrentUser();

  const usedBytes = user?.storage_used ? Number(user.storage_used) : 0;
  const quotaBytes = user?.storage_quota ? Number(user.storage_quota) : 0;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col h-full w-[248px] flex-shrink-0 bg-[#eff1fb] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        ].join(" ")}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="px-5 pt-5 pb-4 flex items-center justify-between">
          <Link to="/dashboard" className="block">
            <p className="text-xl font-bold text-[#1c3fc4] leading-none">Yonopod</p>
            <p className="text-xs text-[#64748b] mt-0.5">Premium Storage</p>
          </Link>
          <button 
            className="md:hidden p-1 text-[#64748b] hover:bg-[#e2e8f0] rounded-md"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

      {/* New Folder Button */}
      <div className="px-4 pb-4">
        <Link
          to="/files?new-folder=true"
          className="flex items-center justify-center gap-2 w-full h-9 rounded-lg bg-[#1c3fc4] text-white text-sm font-medium hover:bg-[#1230a0] active:bg-[#0f2690] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c3fc4]"
        >
          <Plus size={16} />
          New Folder
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {mainNavItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              to={href}
              className={[
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-[#1c3fc4] text-white font-medium"
                  : "text-[#374151] hover:bg-white/60 hover:text-[#0f172a]",
              ].join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Settings + Storage */}
      <div className="px-3 py-4 border-t border-[#e2e8f0] flex flex-col gap-3">
        <Link
          to="/settings"
          className={[
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
            pathname.startsWith("/settings")
              ? "bg-[#1c3fc4] text-white font-medium"
              : "text-[#374151] hover:bg-white/60 hover:text-[#0f172a]",
          ].join(" ")}
        >
          <Settings size={18} className="flex-shrink-0" />
          <span>Settings</span>
        </Link>

        {/* Storage Bar */}
        <div className="px-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#64748b]">Storage</span>
            <span className="text-xs font-medium text-[#374151]">
              {formatFileSize(usedBytes)} / {formatFileSize(quotaBytes)}
            </span>
          </div>
          <ProgressBar value={usedBytes} max={quotaBytes || 1} size="sm" />
        </div>
      </div>
    </aside>
    </>
  );
}
