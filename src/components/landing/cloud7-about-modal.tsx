import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";

interface Cloud7AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Cloud7AboutModal({ isOpen, onClose }: Cloud7AboutModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white border border-[#d9dfe0] p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>

        {/* Section Heading (No Pill Badge) */}
        <div className="text-xs font-sans font-bold uppercase tracking-widest text-[#1c3fc4] mb-2">
          About & Contact
        </div>

        <h2 className="text-3xl sm:text-4xl font-display font-medium text-[#131a1b] mb-2">
          Get in touch
        </h2>
        <p className="text-sm font-sans text-[#5e7277] mb-6 leading-relaxed">
          Hubungi tim pengembang <strong>PT. ALENERVERSE NEXUS TECHNOLOGY</strong> untuk konsultasi kebutuhan cloud storage atau integrasi enterprise.
        </p>

        {submitted ? (
          <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
            <h3 className="text-lg font-display font-medium text-emerald-900">Pesan Terkirim!</h3>
            <p className="text-xs font-sans text-emerald-700">
              Terima kasih telah menghubungi kami. Tim kami akan segera menanggapi pesan Anda.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center px-5 py-2 rounded-[4px] bg-[#1c3fc4] text-white font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#1230a0] transition-colors mt-2"
            >
              Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#131a1b] mb-1">
                Nama Lengkap *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full px-3.5 py-2.5 rounded-[4px] border border-[#d9dfe0] text-sm font-sans text-[#131a1b] focus:outline-none focus:border-[#1c3fc4]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#131a1b] mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-3.5 py-2.5 rounded-[4px] border border-[#d9dfe0] text-sm font-sans text-[#131a1b] focus:outline-none focus:border-[#1c3fc4]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#131a1b] mb-1">
                Pesan / Pertanyaan
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan kebutuhan atau pertanyaan Anda..."
                className="w-full px-3.5 py-2.5 rounded-[4px] border border-[#d9dfe0] text-sm font-sans text-[#131a1b] focus:outline-none focus:border-[#1c3fc4]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-sans text-[#5e7277] font-medium">
                PT. ALENERVERSE NEXUS TECHNOLOGY
              </span>
              <button
                type="submit"
                className="inline-flex items-center justify-center py-2.5 px-6 rounded-[4px] bg-[#1c3fc4] text-white font-sans font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-[#1230a0] transition-all cursor-pointer"
              >
                Kirim Pesan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
