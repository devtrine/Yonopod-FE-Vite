import { useState, useRef, useEffect } from "react";
import { Bell, HelpCircle, Upload, Menu, LogOut, Settings, User } from "lucide-react";
import { GlobalSearch } from "@/components/search/search-bar";
import { Link } from "react-router-dom";
import { Avatar } from "../ui/avatar";
import { useSidebar } from "./sidebar-context";
import { useCurrentUser, useLogout } from "../../hooks/use-auth";
import { useUIStore } from "../../stores/ui-store";

export function Header() {
  const { toggle } = useSidebar();
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const { openUploadModal } = useUIStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const displayName = user?.full_name || user?.username || "User";

  return (
    <header className="h-[57px] flex items-center gap-4 px-4 md:px-6 bg-white border-b border-[#e2e8f0] flex-shrink-0">
      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden flex-shrink-0 p-2 -ml-2 text-[#64748b] hover:bg-[#f1f5f9] rounded-lg"
        onClick={toggle}
        aria-label="Toggle Menu"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <GlobalSearch />

      {/* Right actions */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Notification */}
        <button
          aria-label="Notifications"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors"
        >
          <Bell size={18} />
        </button>

        {/* Help */}
        <button
          aria-label="Help"
          className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors"
        >
          <HelpCircle size={18} />
        </button>

        {/* Upload Button */}
        <button
          type="button"
          onClick={() => openUploadModal(null)}
          className="flex items-center justify-center md:gap-2 w-9 h-9 md:w-auto md:px-4 ml-1 rounded-lg bg-[#1c3fc4] text-white text-sm font-medium hover:bg-[#1230a0] active:bg-[#0f2690] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c3fc4]"
          aria-label="Upload files"
        >
          <Upload size={15} />
          <span className="hidden md:inline">Upload</span>
        </button>

        {/* Avatar with dropdown */}
        <div className="relative ml-1" ref={menuRef}>
          <button
            aria-label="User account"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c3fc4]"
          >
            <Avatar name={displayName} size="md" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-11 w-56 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#e2e8f0] py-1.5 z-50"
            >
              {/* User info */}
              <div className="px-4 py-2.5 border-b border-[#f1f5f9]">
                <p className="text-sm font-semibold text-[#0f172a] truncate">{displayName}</p>
                <p className="text-xs text-[#64748b] truncate">{user?.email}</p>
              </div>

              {/* Links */}
              <Link
                to="/settings/profile"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-[#374151] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors"
              >
                <User size={16} className="text-[#94a3b8]" />
                Profile
              </Link>
              <Link
                to="/settings"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-[#374151] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors"
              >
                <Settings size={16} className="text-[#94a3b8]" />
                Settings
              </Link>

              <div className="border-t border-[#f1f5f9] mt-1.5 pt-1.5">
                <button
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    logout.mutate();
                  }}
                  disabled={logout.isPending}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[#ef4444] hover:bg-[#fef2f2] transition-colors disabled:opacity-50"
                >
                  <LogOut size={16} />
                  {logout.isPending ? "Signing out…" : "Sign Out"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
