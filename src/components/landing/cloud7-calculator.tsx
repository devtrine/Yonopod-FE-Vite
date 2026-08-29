import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function Cloud7Calculator() {
  const [storageGB, setStorageGB] = useState<number>(500);
  const [trafficGB, setTrafficGB] = useState<number>(100);

  const RATE_PER_GB = 400; // Rp 400 / GB proposal standard

  const yonopodMonthly = storageGB * RATE_PER_GB;
  const yonopodYearly = yonopodMonthly * 12;

  const awsYearly = Math.round(storageGB * 450 * 12 + trafficGB * 1200 * 12);
  const fixed2TBYearly = 150000 * 12;
  const fixed5TBYearly = 350000 * 12;

  const formatIDR = (val: number) => {
    return "Rp " + new Intl.NumberFormat("id-ID").format(val);
  };

  const chartData = [
    { name: "YONOPOD", value: yonopodYearly, isYonopod: true },
    { name: "AWS S3 Cloud", value: awsYearly, isYonopod: false },
    { name: "Fixed 2TB Plan", value: fixed2TBYearly, isYonopod: false },
    { name: "Fixed 5TB Plan", value: fixed5TBYearly, isYonopod: false },
  ];

  const maxVal = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <section id="pricing" className="py-20 md:py-28 bg-[#f4f5f6] border-t border-[#d9dfe0]">
      <div className="w-[88%] max-w-[75rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Calculator Main Card */}
        <div className="rounded-3xl bg-white border border-[#d9dfe0] p-8 sm:p-12 lg:p-14 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Form Column */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <div className="text-xs font-sans font-bold uppercase tracking-widest text-[#1c3fc4] mb-3">
                  Pricing
                </div>
                <h2 className="text-4xl sm:text-5xl font-display font-medium tracking-tight text-[#131a1b] leading-tight">
                  Pay as You Go.
                </h2>
                <p className="text-sm sm:text-base font-sans text-[#5e7277] mt-3 leading-relaxed">
                  Tidak ada biaya langganan kaku untuk kapasitas kosong. Struktur biaya transparan kami memastikan Anda hanya membayar untuk data yang benar-benar Anda simpan. <span className="text-[#1c3fc4] font-bold">*</span>
                </p>
              </div>

              {/* Slider 1: Storage */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="storage-input" className="text-xs font-sans font-bold uppercase tracking-wider text-[#131a1b]">
                    Kapasitas Penyimpanan (Storage)
                  </label>
                  <div className="flex items-center gap-1 bg-[#f4f5f6] px-3 py-1 rounded-[4px] border border-[#d9dfe0]">
                    <input
                      id="storage-input"
                      type="number"
                      min={10}
                      max={5000}
                      value={storageGB}
                      onChange={(e) => setStorageGB(Math.max(1, Number(e.target.value)))}
                      className="w-16 bg-transparent text-right font-mono font-bold text-sm text-[#131a1b] focus:outline-none"
                    />
                    <span className="text-xs font-bold text-[#5e7277] font-mono">GB</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={10}
                  max={5000}
                  step={10}
                  value={storageGB}
                  onChange={(e) => setStorageGB(Number(e.target.value))}
                  className="c7-range"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#8ba0a5]">
                  <span>10 GB</span>
                  <span>1.000 GB (1 TB)</span>
                  <span>2.500 GB</span>
                  <span>5.000 GB (5 TB)</span>
                </div>
              </div>

              {/* Slider 2: Download / Traffic */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="traffic-input" className="text-xs font-sans font-bold uppercase tracking-wider text-[#131a1b]">
                    Estimasi Download Bulanan
                  </label>
                  <div className="flex items-center gap-1 bg-[#f4f5f6] px-3 py-1 rounded-[4px] border border-[#d9dfe0]">
                    <input
                      id="traffic-input"
                      type="number"
                      min={0}
                      max={5000}
                      value={trafficGB}
                      onChange={(e) => setTrafficGB(Math.max(0, Number(e.target.value)))}
                      className="w-16 bg-transparent text-right font-mono font-bold text-sm text-[#131a1b] focus:outline-none"
                    />
                    <span className="text-xs font-bold text-[#5e7277] font-mono">GB</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={5000}
                  step={10}
                  value={trafficGB}
                  onChange={(e) => setTrafficGB(Number(e.target.value))}
                  className="c7-range"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#8ba0a5]">
                  <span>0 GB</span>
                  <span>500 GB</span>
                  <span>2.500 GB</span>
                  <span>5.000 GB</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-[4px] bg-[#1c3fc4] text-white font-sans font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-[#1230a0] transition-all w-full sm:w-auto"
                >
                  <span>Mulai Simpan di Yonopod</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right Graph Column (Comparative Bar Chart) */}
            <div className="lg:col-span-6 bg-[#f8fafc] border border-[#d9dfe0] rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-4 border-b border-[#d9dfe0] mb-6">
                <div>
                  <span className="text-xs font-mono font-bold uppercase text-[#5e7277]">
                    Perbandingan Proyeksi Tahunan
                  </span>
                  <p className="text-lg font-display font-medium text-[#131a1b]">
                    Estimasi Biaya vs Layanan Lain
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#8ba0a5] block font-mono">Tarif Yonopod</span>
                  <span className="text-sm font-extrabold text-[#1c3fc4] font-mono">Rp 400 / GB</span>
                </div>
              </div>

              {/* Dynamic Bars */}
              <div className="space-y-5 my-2">
                {chartData.map((item, idx) => {
                  const percentage = Math.max(8, Math.round((item.value / maxVal) * 100));
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-sans font-semibold">
                        <span className={item.isYonopod ? "text-[#1c3fc4] font-bold" : "text-[#5e7277]"}>
                          {item.name}
                        </span>
                        <span className="font-mono text-[#131a1b] font-bold">
                          {formatIDR(item.value)} <span className="text-[10px] text-[#8ba0a5]">/ thn</span>
                        </span>
                      </div>
                      <div className="w-full bg-[#d9dfe0] h-6 rounded-[4px] overflow-hidden flex items-center p-0.5">
                        <div
                          className={`h-full rounded-[2px] transition-all duration-500 flex items-center px-2 text-[10px] font-sans font-bold text-white ${
                            item.isYonopod
                              ? "bg-[#1c3fc4]"
                              : "bg-[#8ba0a5]"
                          }`}
                          style={{ width: `${percentage}%` }}
                        >
                          {item.isYonopod && "TERHEMAT"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Monthly Cost Highlight */}
              <div className="mt-8 pt-4 border-t border-[#d9dfe0] flex items-center justify-between">
                <div>
                  <span className="text-xs font-sans text-[#5e7277]">Biaya Berjalan Yonopod Bulanan:</span>
                  <p className="text-2xl font-extrabold text-[#1c3fc4] font-mono">
                    {formatIDR(yonopodMonthly)} <span className="text-xs font-normal text-[#5e7277]">/ bln</span>
                  </p>
                </div>
                <div className="text-right text-[11px] text-[#5e7277] font-mono">
                  {storageGB} GB × Rp 400
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div className="text-center mt-6 text-xs font-sans text-[#8ba0a5] max-w-2xl mx-auto leading-relaxed">
          <span className="text-[#1c3fc4] font-bold">*</span> Berdasarkan skema pengembangan resmi Yonopod. Tarif disesuaikan secara proporsional dengan kapasitas data aktif yang Anda kelola di platform.
        </div>
      </div>
    </section>
  );
}
