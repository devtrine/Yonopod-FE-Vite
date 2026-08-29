import { useState } from "react";
import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Film, 
  Archive, 
  Lock, 
  Eye, 
  Clock, 
  Key,
  HardDrive
} from "lucide-react";

export function Cloud7Cases() {
  const [activeTab, setActiveTab] = useState<"files" | "monitoring" | "security" | "sharing">("files");

  return (
    <section id="fitur-utama" className="py-20 md:py-28 bg-[#f4f5f6] border-t border-[#d9dfe0]">
      <div className="w-[88%] max-w-[75rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-sans font-bold uppercase tracking-widest text-[#1c3fc4] mb-3">
            Fitur Utama
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium tracking-tight text-[#131a1b] leading-tight mb-4">
            Solusi Penyimpanan Berbasis Web.
          </h2>
          <p className="text-[#5e7277] font-sans text-base sm:text-lg leading-relaxed">
            Platform komprehensif untuk mengelola berkas, menganalisis alokasi kapasitas, melindungi dokumen privat, dan membagikan data secara terstruktur.
          </p>
        </div>

        {/* Tab Navigation Controls (Plain Text / Minimal Tabs) */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-4 mb-10 border-b border-[#d9dfe0]">
          <button
            type="button"
            onClick={() => setActiveTab("files")}
            className={`px-4 py-2 text-xs sm:text-sm font-sans font-bold rounded-[4px] transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "files"
                ? "bg-[#1c3fc4] text-white shadow-xs"
                : "bg-white text-[#5e7277] border border-[#d9dfe0] hover:text-[#131a1b]"
            }`}
          >
            File & Folder Management
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("monitoring")}
            className={`px-4 py-2 text-xs sm:text-sm font-sans font-bold rounded-[4px] transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "monitoring"
                ? "bg-[#1c3fc4] text-white shadow-xs"
                : "bg-white text-[#5e7277] border border-[#d9dfe0] hover:text-[#131a1b]"
            }`}
          >
            Dashboard Monitoring
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 text-xs sm:text-sm font-sans font-bold rounded-[4px] transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "security"
                ? "bg-[#1c3fc4] text-white shadow-xs"
                : "bg-white text-[#5e7277] border border-[#d9dfe0] hover:text-[#131a1b]"
            }`}
          >
            Security & Private Vault
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sharing")}
            className={`px-4 py-2 text-xs sm:text-sm font-sans font-bold rounded-[4px] transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "sharing"
                ? "bg-[#1c3fc4] text-white shadow-xs"
                : "bg-white text-[#5e7277] border border-[#d9dfe0] hover:text-[#131a1b]"
            }`}
          >
            Sharing & Permissions
          </button>
        </div>

        {/* Dynamic Editorial Visual Stage */}
        <div className="bg-white rounded-2xl border border-[#d9dfe0] p-6 sm:p-10 shadow-sm">
          {/* TAB 1: File & Folder Management */}
          {activeTab === "files" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-mono font-bold text-[#1c3fc4] uppercase">
                  MANAJEMEN BERKAS & FOLDER
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-medium text-[#131a1b] leading-tight">
                  Struktur Fleksibel dengan Folder Size Analyzer.
                </h3>
                <p className="text-sm font-sans text-[#5e7277] leading-relaxed">
                  Kelola file melalui fitur upload, download, preview gambar dan video, rename, delete, copy & move, serta upload folder secara teratur.
                </p>
                <div className="space-y-2 pt-2 border-t border-[#d9dfe0]">
                  <div className="flex items-center gap-2 text-xs font-sans text-[#131a1b]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1c3fc4]" />
                    <span>Upload file & folder langsung dari peramban</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans text-[#131a1b]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1c3fc4]" />
                    <span>Struktur direktori bertingkat (Nested Folders)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans text-[#131a1b]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1c3fc4]" />
                    <span>Folder Size Analyzer untuk analisis ukuran per subdirektori</span>
                  </div>
                </div>
              </div>

              {/* Realistic Yonopod File Explorer Visual */}
              <div className="lg:col-span-7 bg-[#f8fafc] border border-[#d9dfe0] rounded-xl overflow-hidden">
                <div className="bg-[#eff1fb]/60 px-4 py-3 border-b border-[#d9dfe0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Folder size={16} className="text-[#1c3fc4]" />
                    <span className="text-xs font-mono font-bold text-[#131a1b]">/ Dokumen-Proyek / 2026</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#5e7277]">4 Berkas • 124.5 MB</span>
                </div>

                <div className="p-4 divide-y divide-[#d9dfe0]">
                  <div className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-blue-600" />
                      <span className="font-semibold text-[#131a1b]">proposal_pengembangan.pdf</span>
                    </div>
                    <div className="flex items-center gap-4 text-[#5e7277] font-mono text-[11px]">
                      <span>4.2 MB</span>
                      <span className="text-[#1c3fc4] font-semibold">Preview</span>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <ImageIcon size={16} className="text-emerald-600" />
                      <span className="font-semibold text-[#131a1b]">skema_arsitektur.png</span>
                    </div>
                    <div className="flex items-center gap-4 text-[#5e7277] font-mono text-[11px]">
                      <span>2.8 MB</span>
                      <span className="text-[#1c3fc4] font-semibold">Preview</span>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <Archive size={16} className="text-amber-600" />
                      <span className="font-semibold text-[#131a1b]">dataset_backup.zip</span>
                    </div>
                    <div className="flex items-center gap-4 text-[#5e7277] font-mono text-[11px]">
                      <span>115.0 MB</span>
                      <span className="text-[#1c3fc4] font-semibold">Download</span>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <Film size={16} className="text-purple-600" />
                      <span className="font-semibold text-[#131a1b]">demo_antarmuka.mp4</span>
                    </div>
                    <div className="flex items-center gap-4 text-[#5e7277] font-mono text-[11px]">
                      <span>2.5 MB</span>
                      <span className="text-[#1c3fc4] font-semibold">Preview</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Dashboard Monitoring */}
          {activeTab === "monitoring" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-mono font-bold text-[#1c3fc4] uppercase">
                  MONITORING KAPASITAS
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-medium text-[#131a1b] leading-tight">
                  Ketahui Alokasi Ruang Secara Presisi.
                </h3>
                <p className="text-sm font-sans text-[#5e7277] leading-relaxed">
                  Pantau Total Storage, Used Storage, Remaining Storage, persentase penggunaan, statistik berdasarkan tipe file, serta daftar folder dan file terbesar.
                </p>
                <div className="space-y-2 pt-2 border-t border-[#d9dfe0]">
                  <div className="flex items-center gap-2 text-xs font-sans text-[#131a1b]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1c3fc4]" />
                    <span>Informasi kuota aktif vs sisa ruang penyimpanan</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans text-[#131a1b]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1c3fc4]" />
                    <span>Statistik proporsi berkas (Dokumen, Gambar, Video, Arsip)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans text-[#131a1b]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1c3fc4]" />
                    <span>Identifikasi folder dan file terbesar secara langsung</span>
                  </div>
                </div>
              </div>

              {/* Realistic Yonopod Monitoring Panel Visual */}
              <div className="lg:col-span-7 bg-[#f8fafc] border border-[#d9dfe0] rounded-xl p-6 space-y-5">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white p-3 rounded-lg border border-[#d9dfe0]">
                    <span className="text-[10px] font-sans font-bold text-[#5e7277] uppercase block">Total Storage</span>
                    <span className="text-base font-mono font-bold text-[#131a1b]">500 GB</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#d9dfe0]">
                    <span className="text-[10px] font-sans font-bold text-[#5e7277] uppercase block">Used Storage</span>
                    <span className="text-base font-mono font-bold text-[#1c3fc4]">142.8 GB</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#d9dfe0]">
                    <span className="text-[10px] font-sans font-bold text-[#5e7277] uppercase block">Remaining</span>
                    <span className="text-base font-mono font-bold text-emerald-600">357.2 GB</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-sans font-semibold text-[#131a1b]">
                    <span>Persentase Penggunaan Kuota</span>
                    <span className="font-mono">28.5%</span>
                  </div>
                  <div className="w-full h-3 bg-[#d9dfe0] rounded-full overflow-hidden flex">
                    <div className="bg-[#1c3fc4] h-full" style={{ width: "45%" }} title="Dokumen" />
                    <div className="bg-emerald-500 h-full" style={{ width: "30%" }} title="Gambar" />
                    <div className="bg-amber-500 h-full" style={{ width: "15%" }} title="Arsip" />
                    <div className="bg-purple-500 h-full" style={{ width: "10%" }} title="Lainnya" />
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-[#d9dfe0] p-3 space-y-2">
                  <span className="text-[11px] font-sans font-bold text-[#131a1b] block">Direktori Terbesar</span>
                  <div className="flex items-center justify-between text-xs text-[#5e7277]">
                    <span className="font-mono">/Proyek-2026/Aset-Media</span>
                    <span className="font-mono font-semibold text-[#131a1b]">84.2 GB</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#5e7277]">
                    <span className="font-mono">/Dokumen-Legal/Arsip</span>
                    <span className="font-mono font-semibold text-[#131a1b]">32.6 GB</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Security & Private Vault */}
          {activeTab === "security" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-mono font-bold text-[#1c3fc4] uppercase">
                  KEAMANAN & PRIVASI
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-medium text-[#131a1b] leading-tight">
                  Folder Lock & Audit Log Terintegrasi.
                </h3>
                <p className="text-sm font-sans text-[#5e7277] leading-relaxed">
                  Lindungi data sensitif menggunakan Folder Lock / Private Vault, HTTPS, Audit Log, Session Management, Login Activity, dan Device Management.
                </p>
                <div className="space-y-2 pt-2 border-t border-[#d9dfe0]">
                  <div className="flex items-center gap-2 text-xs font-sans text-[#131a1b]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1c3fc4]" />
                    <span>Private Vault terproteksi kata sandi untuk berkas rahasia</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans text-[#131a1b]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1c3fc4]" />
                    <span>Audit Log kronologis mencatat riwayat aktivitas berkas</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans text-[#131a1b]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1c3fc4]" />
                    <span>Manajemen sesi aktif dan perangkat login</span>
                  </div>
                </div>
              </div>

              {/* Realistic Yonopod Private Vault & Audit Log Visual */}
              <div className="lg:col-span-7 bg-[#f8fafc] border border-[#d9dfe0] rounded-xl p-5 space-y-4">
                <div className="bg-white p-3.5 rounded-lg border border-[#d9dfe0] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-[#eff1fb] flex items-center justify-center text-[#1c3fc4]">
                      <Lock size={16} />
                    </div>
                    <div>
                      <span className="text-xs font-sans font-bold text-[#131a1b] block">Private Vault Aktif</span>
                      <span className="text-[11px] font-sans text-[#5e7277]">Folder terproteksi kata sandi khusus</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    LOCKED
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-sans font-bold text-[#131a1b] block">Aktivitas Audit Log Terbaru</span>
                  <div className="space-y-1.5 text-[11px] font-mono">
                    <div className="p-2 bg-white rounded border border-[#d9dfe0] flex items-center justify-between text-[#5e7277]">
                      <span>UPLOAD: proposal.pdf</span>
                      <span className="text-[#8ba0a5]">2 menit lalu</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-[#d9dfe0] flex items-center justify-between text-[#5e7277]">
                      <span>VAULT LOCK: dokumen_keuangan/</span>
                      <span className="text-[#8ba0a5]">15 menit lalu</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-[#d9dfe0] flex items-center justify-between text-[#5e7277]">
                      <span>SESSION: Login dari Chrome (Windows)</span>
                      <span className="text-[#8ba0a5]">Hari ini, 08:30</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Sharing */}
          {activeTab === "sharing" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-mono font-bold text-[#1c3fc4] uppercase">
                  BERBAGI & HAK AKSES
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-medium text-[#131a1b] leading-tight">
                  Tautan Berbagi Terproteksi & Berbatas Waktu.
                </h3>
                <p className="text-sm font-sans text-[#5e7277] leading-relaxed">
                  Bagikan file dan folder melalui link atau form dengan opsi Expired Link, Password Protected Link, Download Limit, dan Read-Only Permission.
                </p>
                <div className="space-y-2 pt-2 border-t border-[#d9dfe0]">
                  <div className="flex items-center gap-2 text-xs font-sans text-[#131a1b]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1c3fc4]" />
                    <span>Tautan dengan tanggal kedaluwarsa (Expired Link)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans text-[#131a1b]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1c3fc4]" />
                    <span>Proteksi kata sandi untuk mencegah akses tidak sah</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans text-[#131a1b]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1c3fc4]" />
                    <span>Batas unduhan (Download Limit) dan izin baca saja</span>
                  </div>
                </div>
              </div>

              {/* Realistic Yonopod Sharing Configuration Visual */}
              <div className="lg:col-span-7 bg-[#f8fafc] border border-[#d9dfe0] rounded-xl p-5 space-y-4">
                <div className="bg-white p-3 rounded-lg border border-[#d9dfe0] space-y-1.5">
                  <span className="text-[11px] font-sans font-bold text-[#131a1b] block">Tautan Berbagi Publik</span>
                  <div className="flex items-center justify-between bg-[#f4f5f6] px-3 py-1.5 rounded border border-[#d9dfe0] text-xs font-mono text-[#5e7277]">
                    <span className="truncate">https://yonopod.app/share/d9a8f1</span>
                    <span className="text-[#1c3fc4] font-bold shrink-0 ml-2">Salin</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-[#d9dfe0] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[#1c3fc4]" />
                      <span className="font-medium text-[#131a1b]">Expired Link</span>
                    </div>
                    <span className="font-mono text-[#5e7277]">7 Hari</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#d9dfe0] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key size={14} className="text-[#1c3fc4]" />
                      <span className="font-medium text-[#131a1b]">Password</span>
                    </div>
                    <span className="font-mono text-emerald-600 font-bold">Aktif</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#d9dfe0] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HardDrive size={14} className="text-[#1c3fc4]" />
                      <span className="font-medium text-[#131a1b]">Download Limit</span>
                    </div>
                    <span className="font-mono text-[#5e7277]">10 Unduhan</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#d9dfe0] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye size={14} className="text-[#1c3fc4]" />
                      <span className="font-medium text-[#131a1b]">Izin Akses</span>
                    </div>
                    <span className="font-mono text-[#5e7277]">Read Only</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
