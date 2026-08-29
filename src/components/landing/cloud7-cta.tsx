import { Link } from "react-router-dom";

export function Cloud7CTA() {
  return (
    <section id="cta" className="py-20 md:py-28 bg-[#f4f5f6]">
      <div className="w-[88%] max-w-[75rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#242828] text-white p-8 sm:p-14 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-xl text-center md:text-left space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
              Storage That Works Around You.
            </h2>
            <p className="text-sm sm:text-base font-sans text-slate-400 leading-relaxed">
              Platform cloud storage fleksibel dengan harga terjangkau dan transparansi total.
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-[4px] bg-[#1c3fc4] text-white font-sans font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#1230a0] transition-all"
            >
              Get Started
            </Link>
            <span className="text-[11px] font-sans text-slate-500">
              Daftar gratis tanpa komitmen kaku.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
