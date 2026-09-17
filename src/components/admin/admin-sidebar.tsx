import { Link, useLocation } from "react-router-dom";
import { Settings, X } from "lucide-react";
import { useSidebar } from "../layout/sidebar-context";
import { adminNavItems } from "@/config/navigation";

export function AdminSidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { isOpen, setIsOpen } = useSidebar();

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
        aria-label="Admin navigation"
      >
        {/* Logo */}
        <div className="relative h-[57px] px-4 flex items-center justify-center bg-[#0F0A6B] border-b-2 border-r-2 border-black -mr-[1px] flex-shrink-0">
          <Link to="/admin" className="flex items-center justify-center hover:opacity-90 transition-opacity">
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

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {adminNavItems.map(({ label, href, icon: Icon }) => {
            const isActive =
              pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                to={href}
                className={[
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-[#0F0A6B] text-white font-medium shadow-sm"
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

        {/* Bottom: Settings */}
        <div className="px-3 py-4 border-t border-[#e2e8f0]">
          <Link
            to="/admin/settings"
            className={[
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname.startsWith("/admin/settings")
                ? "bg-[#0F0A6B] text-white font-medium shadow-sm"
                : "text-[#374151] hover:bg-[#0F0A6B]/5 hover:text-[#0F0A6B]",
            ].join(" ")}
          >
            <Settings size={18} className="flex-shrink-0" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
