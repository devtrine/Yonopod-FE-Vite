import { useState } from "react";
import { MoreHorizontal, Shield, Activity, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Pagination } from "@/components/ui/pagination";

const mockUsers = [
  { id: "u1", name: "Budi Santoso", email: "budi@example.com", role: "Admin", status: "Aktif", storageUsed: 120, storageTotal: 2000, lastLogin: "Hari ini, 08:30" },
  { id: "u2", name: "Sarah Jenkins", email: "sarah@example.com", role: "User", status: "Aktif", storageUsed: 45, storageTotal: 100, lastLogin: "Kemarin, 14:15" },
  { id: "u3", name: "Alex Chen", email: "alex@example.com", role: "User", status: "Aktif", storageUsed: 85, storageTotal: 100, lastLogin: "Okt 24, 2024" },
  { id: "u4", name: "Dina Mariana", email: "dina@example.com", role: "User", status: "Non-aktif", storageUsed: 12, storageTotal: 100, lastLogin: "Okt 10, 2024" },
];

export function AdminUsersPage() {
  const [page, setPage] = useState(1);

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto w-full flex flex-col gap-8">
      
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Kelola Pengguna</h1>
          <p className="text-[#64748b]">Manajemen akun pengguna dan alokasi penyimpanan.</p>
        </div>
        <button className="h-10 px-4 bg-[#1c3fc4] text-white rounded-lg text-sm font-medium hover:bg-[#1230a0] transition-colors">
          + Tambah Pengguna
        </button>
      </header>

      <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                <th className="px-6 py-4 font-semibold text-[#64748b] text-xs uppercase tracking-wider">Pengguna</th>
                <th className="px-6 py-4 font-semibold text-[#64748b] text-xs uppercase tracking-wider">Role & Status</th>
                <th className="px-6 py-4 font-semibold text-[#64748b] text-xs uppercase tracking-wider">Penggunaan Storage</th>
                <th className="px-6 py-4 font-semibold text-[#64748b] text-xs uppercase tracking-wider">Aktivitas Terakhir</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} size="md" />
                      <div>
                        <p className="font-semibold text-[#0f172a]">{user.name}</p>
                        <p className="text-xs text-[#64748b]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-1.5">
                      <div className="flex items-center gap-1.5 text-[#0f172a] font-medium text-xs">
                        {user.role === "Admin" ? <Shield size={14} className="text-[#1c3fc4]" /> : <Users size={14} className="text-[#64748b]" />}
                        {user.role}
                      </div>
                      <Badge variant={user.status === "Aktif" ? "success" : "neutral"}>
                        {user.status}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 w-32">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-[#0f172a]">{user.storageUsed} GB</span>
                        <span className="text-[#64748b]">{user.storageTotal} GB</span>
                      </div>
                      <ProgressBar 
                        value={user.storageUsed} 
                        max={user.storageTotal} 
                        size="sm" 
                        variant={user.storageUsed / user.storageTotal > 0.8 ? "warning" : "default"} 
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[#64748b]">
                      <Activity size={14} />
                      {user.lastLogin}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#64748b] transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-[#e2e8f0]">
          <Pagination page={page} totalPages={10} onPageChange={setPage} totalItems={124} itemsPerPage={10} itemLabel="pengguna" />
        </div>
      </div>
    </div>
  );
}
export default AdminUsersPage;
