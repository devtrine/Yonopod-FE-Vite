import { Server, Cpu, Activity, Circle } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";

const mockNodes = [
  { id: "n1", name: "YNP-Node-US1", region: "East US", cpu: 28, memory: 45, uptime: "99.9%", status: "active" },
  { id: "n2", name: "YNP-Node-EU2", region: "West EU", cpu: 92, memory: 88, uptime: "98.5%", status: "critical" },
  { id: "n3", name: "YNP-Node-AP1", region: "Asia Pacific", cpu: 15, memory: 32, uptime: "99.9%", status: "active" },
  { id: "n4", name: "YNP-Node-US2", region: "West US", cpu: 45, memory: 60, uptime: "99.8%", status: "active" },
];

export function AdminServersPage() {
  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto w-full flex flex-col gap-8">
      
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#0f172a]">Pemantauan Server</h1>
        <p className="text-[#64748b]">Ikhtisar status jaringan, kinerja node, dan beban sistem saat ini.</p>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-[#e2e8f0] bg-white flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#eff1fb] text-[#1c3fc4] flex items-center justify-center">
              <Server size={20} />
            </div>
            <h3 className="font-semibold text-[#0f172a]">Kesehatan Kluster</h3>
          </div>
          <p className="text-4xl font-bold text-[#0f172a] mb-2">98.9%</p>
          <p className="text-sm text-[#64748b]">Status Optimal (24 Node Aktif)</p>
        </div>

        <div className="p-6 rounded-2xl border border-[#e2e8f0] bg-white flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#eff1fb] text-[#1c3fc4] flex items-center justify-center">
              <Cpu size={20} />
            </div>
            <h3 className="font-semibold text-[#0f172a]">Rata-rata CPU</h3>
          </div>
          <p className="text-4xl font-bold text-[#0f172a] mb-2">42%</p>
          <ProgressBar value={42} />
        </div>

        <div className="p-6 rounded-2xl border border-[#e2e8f0] bg-white flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#eff1fb] text-[#1c3fc4] flex items-center justify-center">
              <Activity size={20} />
            </div>
            <h3 className="font-semibold text-[#0f172a]">Lalu Lintas Jaringan</h3>
          </div>
          <p className="text-4xl font-bold text-[#0f172a] mb-2">1.2 TB/s</p>
          <p className="text-sm text-[#64748b]">Lonjakan +15% dari kemarin</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold text-[#0f172a]">Kinerja Sistem (24 Jam Terakhir)</h2>
          <button className="text-sm font-medium text-[#1c3fc4] hover:underline">Lihat Detail Laporan</button>
        </div>
        
        <div className="relative h-[240px] w-full flex items-end justify-between px-4">
          {/* Y Axis Labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-[#64748b] pb-8">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>
          
          {/* Chart Bars */}
          <div className="ml-12 w-full h-full flex items-end justify-around pb-8">
            {[40, 55, 35, 80, 60, 45, 95, 70].map((h, i) => (
              <div key={i} className="w-[8%] bg-[#a5b4fc] rounded-t-sm" style={{ height: `${h}%` }}></div>
            ))}
          </div>

          {/* X Axis Labels */}
          <div className="absolute left-12 right-4 bottom-0 flex justify-between text-xs text-[#64748b]">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>Sekarang</span>
          </div>
        </div>
      </div>

      {/* Node Status */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-[#0f172a]">Status Node Aktif</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockNodes.map((node) => (
            <div 
              key={node.id} 
              className={["p-5 rounded-xl border bg-white flex flex-col", node.status === "critical" ? "border-[#ef4444]" : "border-[#e2e8f0]"].join(" ")}
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-[#0f172a]">{node.name}</h3>
                <Circle size={12} className={node.status === "critical" ? "fill-[#ef4444] text-[#ef4444]" : "fill-[#22c55e] text-[#22c55e]"} />
              </div>
              <p className="text-xs text-[#64748b] mb-6">Region: {node.region}</p>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#64748b]">CPU Load</span>
                    <span className={["font-bold", node.status === "critical" ? "text-[#ef4444]" : "text-[#0f172a]"].join(" ")}>{node.cpu}%</span>
                  </div>
                  <ProgressBar value={node.cpu} size="sm" variant={node.status === "critical" ? "danger" : "default"} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#64748b]">Memory</span>
                    <span className="font-bold text-[#0f172a]">{node.memory}%</span>
                  </div>
                  <ProgressBar value={node.memory} size="sm" />
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 text-xs">
                <span className="text-[#64748b]">Uptime:</span>
                <span className="font-semibold text-[#0f172a]">{node.uptime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
export default AdminServersPage;
