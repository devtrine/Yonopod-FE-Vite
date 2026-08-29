import { Link } from "react-router-dom";

interface Cloud7FooterProps {
  onOpenAboutModal: () => void;
}

export function Cloud7Footer({ onOpenAboutModal }: Cloud7FooterProps) {
  return (
    <footer className="bg-[#131a1b] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="w-[88%] max-w-[75rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Logo Brand YONOPOD (Pure Text, No Icons, No Subtitle) */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-white block">
              YONOPOD
            </Link>
            <p className="text-xs font-sans text-slate-400 leading-relaxed max-w-xs">
              Pengembangan Platform Cloud Storage Berbasis Web dengan Harga Terjangkau.
            </p>
          </div>

          {/* Column 1: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-300">
              Platform
            </h4>
            <ul className="space-y-2 text-xs font-sans text-slate-400">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Private Vault
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Folder Size Analyzer
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-300">
              Company
            </h4>
            <ul className="space-y-2 text-xs font-sans text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={onOpenAboutModal}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About
                </button>
              </li>
              <li>
                <a href="#fitur-utama" className="hover:text-white transition-colors">
                  Solusi Platform
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAboutModal}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-300">
              Legal
            </h4>
            <ul className="space-y-2 text-xs font-sans text-slate-400">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits with Subtle Corporate Entity Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-slate-500">
          <div className="space-y-1 text-center sm:text-left">
            <div className="font-semibold text-slate-400 tracking-wide uppercase text-[11px]">
              PT. ALENERVERSE NEXUS TECHNOLOGY
            </div>
            <p>
              © 2026 YONOPOD. Hak Cipta Dilindungi Undang-Undang.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a href="#main" className="hover:text-white transition-colors">
              Kembali ke Atas
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
