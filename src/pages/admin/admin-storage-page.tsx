import { Cloud, PieChart, Activity, AlertTriangle, HardDrive } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";

export function AdminStoragePage() {
  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto w-full flex flex-col gap-8">
      
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#0f172a]">Monitoring Penyimpanan</h1>
        <p className="text-[#64748b]">Analisis detail penggunaan penyimpanan di seluruh platform Yonopod.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kapasitas Total */}
        <div className="p-6 rounded-2xl border border-[#e2e8f0] bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#1c3fc4] mb-3">
              <Cloud size={20} />
              <h3 className="font-semibold text-[#0f172a]">Kapasitas Total</h3>
            </div>
            <p className="text-sm text-[#64748b]">
              Total kapasitas penyimpanan yang teralokasi pada seluruh server aktif.
            </p>
          </div>
          <div className="mt-8">
            <div className="flex items-end justify-between mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[#0f172a]">8.4</span>
                <span className="text-xl font-bold text-[#0f172a]">PB</span>
              </div>
              <span className="text-sm text-[#64748b]">/ 10 PB</span>
            </div>
            <ProgressBar value={84} />
            <div className="flex justify-between items-center mt-3 text-xs font-semibold">
              <span className="text-[#64748b]">Digunakan: 84%</span>
              <span className="text-[#ef4444] flex items-center gap-1">
                <AlertTriangle size={12} /> Kapasitas Menipis
              </span>
            </div>
          </div>
        </div>

        {/* Distribusi Tipe File */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-[#e2e8f0] bg-white flex flex-col">
          <div className="flex items-center gap-2 text-[#1c3fc4] mb-6">
            <PieChart size={20} />
            <h3 className="font-semibold text-[#0f172a]">Distribusi Tipe File</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-8 flex-1">
            {/* Donut Chart Placeholder */}
            <div className="relative w-40 h-40 flex-shrink-0 rounded-full border-[16px] border-[#eff1fb] border-l-[#1c3fc4] border-t-[#1c3fc4] border-r-[#3b82f6] border-b-[#93c5fd] flex items-center justify-center">
              <div className="text-center">
                <p className="text-xl font-bold text-[#0f172a]">4 Tipe</p>
                <p className="text-xs text-[#64748b]">Utama</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1 w-full">
              <div className="p-4 border border-[#e2e8f0] rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0f172a]">
                    <div className="w-2 h-2 rounded-full bg-[#1c3fc4]" /> Video & Media
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-xl font-bold text-[#0f172a]">3.8 PB</p>
                  <p className="text-sm text-[#64748b]">45%</p>
                </div>
              </div>
              <div className="p-4 border border-[#e2e8f0] rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0f172a]">
                    <div className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Database Backups
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-xl font-bold text-[#0f172a]">2.1 PB</p>
                  <p className="text-sm text-[#64748b]">25%</p>
                </div>
              </div>
              <div className="p-4 border border-[#e2e8f0] rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0f172a]">
                    <div className="w-2 h-2 rounded-full bg-[#fcd34d]" /> Dokumen (PDF, Doc)
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-xl font-bold text-[#0f172a]">1.2 PB</p>
                  <p className="text-sm text-[#64748b]">15%</p>
                </div>
              </div>
              <div className="p-4 border border-[#e2e8f0] rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0f172a]">
                    <div className="w-2 h-2 rounded-full bg-[#ef4444]" /> Lainnya
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-xl font-bold text-[#0f172a]">1.3 PB</p>
                  <p className="text-sm text-[#64748b]">15%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tren Pertumbuhan */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-[#e2e8f0] bg-white flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-[#1c3fc4]">
              <Activity size={20} />
              <h3 className="font-semibold text-[#0f172a]">Tren Pertumbuhan</h3>
            </div>
            <select className="text-xs border border-[#e2e8f0] rounded-md px-2 py-1 bg-white text-[#374151] focus:outline-none cursor-pointer">
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          
          <div className="h-[200px] w-full border rounded-xl border-[#e2e8f0] p-4 flex items-end justify-between gap-1 mt-auto">
            {[20, 25, 28, 30, 35, 38, 38, 45, 50, 55, 60, 65, 65].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm bg-[#dbeafe]" style={{ height: `${h}%` }}></div>
            ))}
            <div className="flex-1 rounded-sm bg-[#1c3fc4]" style={{ height: '70%' }}></div>
            <div className="flex-1 rounded-sm bg-[#1230a0]" style={{ height: '80%' }}></div>
          </div>
        </div>

        {/* Peringatan Kuota */}
        <div className="p-6 rounded-2xl border border-[#e2e8f0] bg-white flex flex-col">
          <div className="flex items-center gap-2 text-[#ef4444] mb-6">
            <AlertTriangle size={20} />
            <h3 className="font-semibold text-[#0f172a]">Peringatan Kuota</h3>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl border border-[#fecaca] bg-[#fee2e2]">
              <div className="flex items-center gap-2 text-sm font-bold text-[#b91c1c] mb-1">
                <HardDrive size={16} /> Server EU-West-02
              </div>
              <p className="text-xs text-[#991b1b] mb-3">Kapasitas tersisa kurang dari 5% (120 GB tersisa).</p>
              <button className="text-xs font-bold text-[#b91c1c] hover:underline">Alokasi Ulang</button>
            </div>
            
            <div className="p-4 rounded-xl border border-[#e2e8f0] bg-[#eff1fb]">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0f172a] mb-1">
                <Cloud size={16} /> Departemen Marketing
              </div>
              <p className="text-xs text-[#64748b] mb-3">Telah mencapai 90% dari kuota grup (2 TB).</p>
              <button className="text-xs font-bold text-[#1c3fc4] hover:underline">Tinjau Penggunaan</button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Penyimpanan Server Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#e2e8f0]">
          <h2 className="text-lg font-semibold text-[#0f172a]">Status Penyimpanan Server</h2>
          <button className="text-sm font-medium text-[#1c3fc4] hover:underline">Lihat Semua</button>
        </div>
        
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <th className="px-6 py-3 font-semibold text-[#64748b] text-xs uppercase tracking-wider">Nama Server</th>
              <th className="px-6 py-3 font-semibold text-[#64748b] text-xs uppercase tracking-wider">Lokasi</th>
              <th className="px-6 py-3 font-semibold text-[#64748b] text-xs uppercase tracking-wider w-1/3">Penggunaan</th>
              <th className="px-6 py-3 font-semibold text-[#64748b] text-xs uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {[
              { id: "1", name: "Core-DB-01", loc: "US-East (N. Virginia)", used: 3.2, total: 4.0, status: "Sehat" },
              { id: "2", name: "Media-Store-AP", loc: "AP-Southeast (Singapore)", used: 2.8, total: 3.0, status: "Kritis" },
              { id: "3", name: "Archive-EU", loc: "EU-Central (Frankfurt)", used: 1.1, total: 3.0, status: "Normal" },
            ].map(row => (
              <tr key={row.id} className="hover:bg-[#f8fafc]">
                <td className="px-6 py-4 font-semibold text-[#0f172a] flex items-center gap-2">
                  <HardDrive size={16} className="text-[#64748b]" /> {row.name}
                </td>
                <td className="px-6 py-4 text-[#64748b]">{row.loc}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-[#0f172a]">{row.used} PB</span>
                      <span className="text-[#64748b]">{row.total} PB</span>
                    </div>
                    <ProgressBar 
                      value={row.used} 
                      max={row.total} 
                      size="sm" 
                      variant={row.status === "Kritis" ? "danger" : "default"} 
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={row.status === "Kritis" ? "danger" : row.status === "Sehat" ? "info" : "neutral"} showDot>
                    {row.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default AdminStoragePage;
