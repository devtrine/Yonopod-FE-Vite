import { useState, useEffect } from "react";

export function Cloud7Features() {
  const [speedVal, setSpeedVal] = useState(985);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeedVal(Math.floor(970 + Math.random() * 25));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className="py-20 md:py-28 bg-[#f4f5f6]">
      <div className="w-[88%] max-w-[75rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header (No Pill Badges!) */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-sans font-bold uppercase tracking-widest text-[#1c3fc4] mb-3">
            Feature Overview
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium tracking-tight text-[#131a1b] leading-tight">
            Secure. Swift. Seamless.
          </h2>
          <p className="text-[#5e7277] font-sans mt-4 text-base sm:text-lg leading-relaxed">
            Dirancang dari nol untuk kecepatan akses browser, keamanan data terstruktur, dan efisiensi ruang simpan.
          </p>
        </div>

        {/* 2x2 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Feature Card 1: Top-notch Security */}
          <div className="rounded-2xl bg-white border border-[#d9dfe0] p-8 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg transition-all">
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-display font-medium text-[#131a1b] mb-2">
                Top-notch Security.
              </h3>
              <p className="text-sm font-sans text-[#5e7277] leading-relaxed">
                Private Vault terproteksi kata sandi, log audit kronologis, dan enkripsi transmisi TLS 1.3.
              </p>
            </div>

            {/* SVG Shield Visual */}
            <div className="h-48 w-full bg-[#f8fafc] rounded-xl border border-slate-100 flex items-center justify-center relative overflow-hidden p-4">
              <svg className="w-full h-full max-w-[280px]" viewBox="0 0 280 140" fill="none">
                <path
                  d="M140 10 L220 35 C220 90, 180 125, 140 135 C100 125, 60 90, 60 35 Z"
                  fill="#eff1fb"
                  stroke="#1c3fc4"
                  strokeWidth="2.5"
                />
                <circle cx="140" cy="65" r="18" fill="#1c3fc4" />
                <path
                  d="M134 65 L138 69 L147 60"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g opacity="0.4">
                  <line x1="20" y1="40" x2="50" y2="40" stroke="#1c3fc4" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="230" y1="40" x2="260" y2="40" stroke="#1c3fc4" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="20" y1="75" x2="50" y2="75" stroke="#1c3fc4" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="230" y1="75" x2="260" y2="75" stroke="#1c3fc4" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="30" y1="110" x2="70" y2="110" stroke="#1c3fc4" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="210" y1="110" x2="250" y2="110" stroke="#1c3fc4" strokeWidth="1.5" strokeDasharray="3 3" />
                </g>
                <text x="140" y="105" fill="#1c3fc4" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="monospace">
                  ENCRYPTED VAULT
                </text>
              </svg>
            </div>
          </div>

          {/* Feature Card 2: Always served fast */}
          <div className="rounded-2xl bg-white border border-[#d9dfe0] p-8 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg transition-all">
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-display font-medium text-[#131a1b] mb-2">
                Always served fast.
              </h3>
              <p className="text-sm font-sans text-[#5e7277] leading-relaxed">
                Streaming berkas dan download berkecepatan tinggi dengan latensi peramban minimal.
              </p>
            </div>

            {/* Speed Counter & Graphic Visual */}
            <div className="h-48 w-full bg-[#f8fafc] rounded-xl border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden p-6">
              <div className="flex items-baseline gap-2 bg-white px-6 py-3 rounded-xl border border-blue-100 shadow-sm">
                <span className="text-4xl font-extrabold font-mono text-[#1c3fc4] tracking-tight">
                  0{speedVal}
                </span>
                <span className="text-sm font-bold text-[#5e7277] font-mono">
                  Mbps
                </span>
              </div>
              <div className="w-48 bg-slate-200 h-2 rounded-full mt-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-[#1c3fc4] h-full rounded-full transition-all duration-700"
                  style={{ width: `${(speedVal / 1000) * 100}%` }}
                />
              </div>
              <span className="text-[11px] text-[#8ba0a5] font-mono mt-2">
                LATENSI: ~12ms • ZERO BOTTLENECK
              </span>
            </div>
          </div>

          {/* Feature Card 3: No vendor lock-in */}
          <div className="rounded-2xl bg-white border border-[#d9dfe0] p-8 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg transition-all">
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-display font-medium text-[#131a1b] mb-2">
                No vendor lock-in.
              </h3>
              <p className="text-sm font-sans text-[#5e7277] leading-relaxed">
                Arsitektur terbuka berbasis REST API dan adapter penyimpanan modular Huby Object Storage.
              </p>
            </div>

            {/* Server Rack & Modular Visual */}
            <div className="h-48 w-full bg-[#f8fafc] rounded-xl border border-slate-100 flex items-center justify-center relative overflow-hidden p-4">
              <svg className="w-full h-full max-w-[260px]" viewBox="0 0 260 130" fill="none">
                <rect x="50" y="15" width="160" height="100" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
                <rect x="60" y="25" width="140" height="22" rx="3" fill="#eff1fb" stroke="#d4ddff" strokeWidth="1" />
                <circle cx="75" cy="36" r="3" fill="#1c3fc4" />
                <rect x="90" y="33" width="70" height="6" rx="2" fill="#93c5fd" />
                <circle cx="185" cy="36" r="2.5" fill="#22c55e" />

                <rect x="60" y="54" width="140" height="22" rx="3" fill="#eff1fb" stroke="#d4ddff" strokeWidth="1" />
                <circle cx="75" cy="65" r="3" fill="#1c3fc4" />
                <rect x="90" y="62" width="55" height="6" rx="2" fill="#93c5fd" />
                <circle cx="185" cy="65" r="2.5" fill="#22c55e" />

                <rect x="60" y="83" width="140" height="22" rx="3" fill="#eff1fb" stroke="#d4ddff" strokeWidth="1" />
                <circle cx="75" cy="94" r="3" fill="#1c3fc4" />
                <rect x="90" y="91" width="80" height="6" rx="2" fill="#93c5fd" />
                <circle cx="185" cy="94" r="2.5" fill="#22c55e" />
              </svg>
            </div>
          </div>

          {/* Feature Card 4: Storage Intelligence */}
          <div className="rounded-2xl bg-white border border-[#d9dfe0] p-8 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg transition-all">
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-display font-medium text-[#131a1b] mb-2">
                Storage Intelligence.
              </h3>
              <p className="text-sm font-sans text-[#5e7277] leading-relaxed">
                Folder Size Analyzer otomatis dan telemetri pemakaian kuota real-time.
              </p>
            </div>

            {/* Global Node Replication Map Visual */}
            <div className="h-48 w-full bg-[#f8fafc] rounded-xl border border-slate-100 flex items-center justify-center relative overflow-hidden p-4">
              <svg className="w-full h-full max-w-[280px]" viewBox="0 0 280 130" fill="none">
                <path d="M40 70 Q 100 20 140 60 T 240 40" stroke="#d4ddff" strokeWidth="1.5" strokeDasharray="3 3" />
                <path d="M60 90 Q 140 110 220 80" stroke="#d4ddff" strokeWidth="1.5" strokeDasharray="3 3" />
                
                <circle cx="40" cy="70" r="5" fill="#1c3fc4" />
                <circle cx="40" cy="70" r="10" stroke="#1c3fc4" strokeWidth="1" opacity="0.5" />

                <circle cx="140" cy="60" r="7" fill="#1c3fc4" />
                <circle cx="140" cy="60" r="14" stroke="#1c3fc4" strokeWidth="1.5" opacity="0.4" />

                <circle cx="240" cy="40" r="5" fill="#1c3fc4" />
                <circle cx="240" cy="40" r="10" stroke="#1c3fc4" strokeWidth="1" opacity="0.5" />

                <circle cx="220" cy="80" r="4" fill="#3b82f6" />

                <text x="140" y="115" fill="#1c3fc4" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="monospace">
                  REAL-TIME QUOTA TELEMETRY
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
