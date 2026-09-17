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

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { isOpen, setIsOpen } = useSidebar();
  const { data: user } = useCurrentUser();

  const usedGB = user?.storage_used
    ? Math.round((Number(user.storage_used) / (1024 * 1024 * 1024)) * 100) / 100
    : 0;
  const totalGB = user?.storage_quota
    ? Math.round((Number(user.storage_quota) / (1024 * 1024 * 1024)) * 100) / 100
    : 0;

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
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#e2e8f0] h-full w-[248px] flex-shrink-0 bg-[#FDFEFF] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        ].join(" ")}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="relative h-[57px] px-4 flex items-center justify-center bg-[#0F0A6B] border-b-4 border-r-4 border-black -mr-[1px] flex-shrink-0">
          <Link to="/dashboard" className="flex items-center justify-center hover:opacity-90 transition-opacity">
            <img
              src="/logo/yonopod_logo.png"
              alt="Yonopod"
              className="h-7 w-auto object-contain max-w-[150px]"
            />
          </Link>
          <button
            className="md:hidden absolute right-4 p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* New Folder Button */}
        <div className="px-4 py-4">
          <Link
            to="/files?new-folder=true"
            className="flex items-center justify-center gap-2 w-full h-9 rounded-[10px] border-2 border-[#0F0A6B] bg-transparent text-[#0F0A6B] text-sm font-medium hover:bg-[#0F0A6B]/5 active:bg-[#0F0A6B]/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F0A6B]"
          >
            <Plus size={16} />
            New Folder
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 flex flex-col gap-1.5 overflow-y-auto">
          {mainNavItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                to={href}
                className={[
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-[#0F0A6B]/10 text-black font-bold shadow-sm"
                    : "text-[#374151] hover:bg-[#0F0A6B]/5 hover:text-[#0F0A6B]",
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
                ? "bg-[#0F0A6B] text-white font-medium shadow-sm"
                : "text-[#374151] hover:bg-[#0F0A6B]/5 hover:text-[#0F0A6B]",
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
                {usedGB} GB / {totalGB} GB
              </span>
            </div>
            <ProgressBar value={usedGB} max={totalGB} size="sm" />
          </div>
        </div>
      </aside>
    </>
  );
}
