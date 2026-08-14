import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { DashboardModals } from "@/components/dashboard/dashboard-modals";
import { RequireAuth } from "@/components/auth/require-auth";

export function DashboardLayout() {
  return (
    <RequireAuth>
      <SidebarProvider>
        <div className="flex h-screen overflow-hidden bg-white">
          {/* Sidebar */}
          <Sidebar />

          {/* Main content */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto bg-white relative">
              <Outlet />
            </main>
          </div>
        </div>
        <DashboardModals />
      </SidebarProvider>
    </RequireAuth>
  );
}
export default DashboardLayout;
