import React from "react";
import { Users, Server, HardDrive, AlertCircle } from "lucide-react";

export function AdminOverviewPage() {
  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto w-full flex flex-col gap-8">
      
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#0f172a]">Admin Overview</h1>
        <p className="text-[#64748b]">Ringkasan sistem dan status platform saat ini.</p>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={Users} title="Total Pengguna" value="12,450" change="+12%" positive />
        <StatCard icon={Server} title="Server Aktif" value="24/24" status="Semua sistem normal" />
        <StatCard icon={HardDrive} title="Penggunaan Penyimpanan" value="8.4 PB" status="84% dari kapasitas total" warning />
      </div>

      {/* Charts & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Network Load Chart (Placeholder) */}
        <div className="lg:col-span-2 rounded-2xl border border-[#e2e8f0] bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#0f172a]">Beban Jaringan (24 Jam)</h2>
            <select className="text-sm border-none bg-transparent text-[#64748b] focus:outline-none cursor-pointer">
              <option>Semua Region</option>
              <option>US East</option>
              <option>Asia Pacific</option>
            </select>
          </div>
          <div className="h-[250px] w-full flex items-end gap-2 pb-6 px-2">
            {/* Mock Chart Bars */}
            {[40, 55, 30, 80, 60, 45, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 bg-[#1c3fc4] bg-opacity-20 rounded-t-sm" style={{ height: `${h}%` }}>
                <div className="w-full bg-[#1c3fc4] rounded-t-sm" style={{ height: '40%' }}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-[#64748b] border-t border-[#f1f5f9] pt-2">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>Sekarang</span>
          </div>
        </div>

        {/* System Alerts */}
        <div className="lg:col-span-1 rounded-2xl border border-[#e2e8f0] bg-white p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#0f172a]">Peringatan Sistem</h2>
            <span className="bg-[#fee2e2] text-[#dc2626] text-xs font-bold px-2 py-1 rounded-full">2 Baru</span>
          </div>
          
          <div className="flex flex-col gap-4 flex-1">
            <AlertItem 
              title="Kapasitas Penyimpanan Hampir Penuh" 
              desc="Server EU-West-02 mencapai 95% kapasitas." 
              time="10 menit lalu" 
              type="danger" 
            />
            <AlertItem 
              title="Lonjakan Lalu Lintas" 
              desc="Terdeteksi lonjakan 200% pada API Gateway region AP." 
              time="1 jam lalu" 
              type="warning" 
            />
            <AlertItem 
              title="Pembaruan Berhasil" 
              desc="Node-US1 berhasil diperbarui ke v2.4.1." 
              time="2 hari lalu" 
              type="success" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon: Icon, title, value, change, positive, status, warning 
}: { 
  icon: React.ElementType, title: string, value: string, change?: string, positive?: boolean, status?: string, warning?: boolean 
}) {
  return (
    <div className="p-6 rounded-2xl border border-[#e2e8f0] bg-white flex flex-col justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#eff1fb] text-[#1c3fc4] flex items-center justify-center">
          <Icon size={20} />
        </div>
        {change && (
          <span className={["text-xs font-semibold px-2 py-1 rounded-md", positive ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#fee2e2] text-[#dc2626]"].join(" ")}>
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-[#64748b] mb-1">{title}</p>
        <p className="text-3xl font-bold text-[#0f172a]">{value}</p>
        {status && (
          <p className={["text-xs mt-2", warning ? "text-[#f59e0b] font-medium" : "text-[#64748b]"].join(" ")}>
            {warning && <AlertCircle size={12} className="inline mr-1" />}
            {status}
          </p>
        )}
      </div>
    </div>
  );
}

function AlertItem({ title, desc, time, type }: { title: string, desc: string, time: string, type: "danger" | "warning" | "success" }) {
  const iconColors = {
    danger: "text-[#ef4444] bg-[#fee2e2]",
    warning: "text-[#f59e0b] bg-[#fef9c3]",
    success: "text-[#16a34a] bg-[#dcfce7]",
  };
  
  return (
    <div className="flex items-start gap-3">
      <div className={["w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center mt-0.5", iconColors[type]].join(" ")}>
        <AlertCircle size={14} />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#0f172a]">{title}</p>
        <p className="text-xs text-[#64748b] mt-0.5">{desc}</p>
        <p className="text-[10px] text-[#94a3b8] mt-1 font-medium uppercase tracking-wide">{time}</p>
      </div>
    </div>
  );
}
export default AdminOverviewPage;
