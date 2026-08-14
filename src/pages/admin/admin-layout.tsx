import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/components/layout/sidebar-context";

export function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
        {/* Admin Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-[#f8fafc] relative">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
export default AdminLayout;
