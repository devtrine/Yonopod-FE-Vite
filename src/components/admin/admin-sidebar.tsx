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
          "fixed inset-y-0 left-0 z-50 flex flex-col h-full w-[248px] flex-shrink-0 bg-[#eff1fb] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        ].join(" ")}
        aria-label="Admin navigation"
      >
        {/* Logo */}
        <div className="px-5 pt-5 pb-6 flex items-center justify-between">
          <Link to="/admin" className="block">
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

      {/* Nav Items */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
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

      {/* Bottom: Settings */}
      <div className="px-3 py-4 border-t border-[#e2e8f0]">
        <Link
          to="/admin/settings"
          className={[
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
            pathname.startsWith("/admin/settings")
              ? "bg-[#1c3fc4] text-white font-medium"
              : "text-[#374151] hover:bg-white/60 hover:text-[#0f172a]",
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
