import { useEffect, useRef } from "react";

interface Cloud7HeroProps {
  onOpenAboutModal: () => void;
}

export function Cloud7Hero({ onOpenAboutModal }: Cloud7HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Clean digital network node & data-mesh particle animation (No blurry glows)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 750);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    // Digital Network Particle Nodes
    const particleCount = Math.floor(Math.min(width, 1200) / 22);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 1.6,
      alpha: Math.random() * 0.45 + 0.25,
    }));

    const maxDistance = 145;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw crisp network connection lines between nearby nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.22;
            ctx.strokeStyle = `rgba(28, 63, 196, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and move crisp network nodes
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(28, 63, 196, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="pt-28 sm:pt-36 pb-16 md:pb-24 bg-[#f4f5f6] text-[#131a1b] relative overflow-hidden">
      {/* Clean Digital Network Mesh Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-80"
      />

      <div className="w-[88%] max-w-[75rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Headline Row 1 */}
          <div className="mb-2">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-medium tracking-tight text-[#131a1b] leading-none">
              Always{" "}
              <span className="bg-gradient-to-r from-[#1c3fc4] via-[#3b82f6] to-[#60a5fa] bg-clip-text text-transparent">
                Flexible
              </span>
            </h1>
          </div>

          {/* Headline Row 2 with Framed Word (No Icons Inside) */}
          <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-4 mb-8">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-medium tracking-tight text-[#131a1b] leading-none">
              Cloud
            </h1>
            <div className="relative inline-flex items-center px-4 py-1 border border-[#a5b5b8] bg-white rounded-lg">
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#1c3fc4] rounded-xs" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#1c3fc4] rounded-xs" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#1c3fc4] rounded-xs" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#1c3fc4] rounded-xs" />
              <span className="text-5xl sm:text-7xl md:text-8xl font-display font-medium tracking-tight text-[#1c3fc4] leading-none">
                Storage
              </span>
            </div>
          </div>

          {/* Proposal-backed Centered Subheading Paragraph */}
          <div className="max-w-[27rem] mx-auto mb-12">
            <p className="text-base sm:text-lg font-sans text-[#5e7277] leading-relaxed font-normal">
              Pengembangan Platform Cloud Storage Berbasis Web dengan Harga Terjangkau. Simpan data sesuai kebutuhan dan bayar hanya kuota yang Anda gunakan.
            </p>
          </div>

          {/* Monochrome Capability Words Strip (Text-Only, No Pills, No Icons) */}
          <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-5 gap-6 py-6 border-y border-[#d9dfe0] mb-14 text-center">
            <div className="text-xs sm:text-sm font-sans font-bold tracking-widest text-[#5e7277] uppercase">
              Cloud Storage
            </div>
            <div className="text-xs sm:text-sm font-sans font-bold tracking-widest text-[#5e7277] uppercase">
              File Management
            </div>
            <div className="text-xs sm:text-sm font-sans font-bold tracking-widest text-[#5e7277] uppercase">
              Private Vault
            </div>
            <div className="text-xs sm:text-sm font-sans font-bold tracking-widest text-[#5e7277] uppercase">
              Audit Log
            </div>
            <div className="text-xs sm:text-sm font-sans font-bold tracking-widest text-[#5e7277] uppercase col-span-2 sm:col-span-1">
              Pay-As-You-Use
            </div>
          </div>

          {/* Large Hero Visual Composition & 3-Part Bottom Card */}
          <div className="w-full max-w-4xl rounded-2xl overflow-hidden bg-white border border-[#d9dfe0] shadow-xl">
            {/* Visual Isometric Composition Area */}
            <div className="h-64 sm:h-88 w-full bg-gradient-to-b from-[#f8fafc] via-[#eff1fb]/40 to-white flex items-center justify-center relative p-6">
              {/* Technical Dot Grid */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `radial-gradient(#1c3fc4 1px, transparent 1px)`,
                  backgroundSize: "22px 22px",
                }}
              />

              {/* High-Fidelity Isometric Storage Architecture Diagram */}
              <div className="relative z-10 flex flex-col items-center">
                <svg className="w-76 sm:w-104 h-auto" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Platform Base Grid */}
                  <path d="M170 10 L320 90 L170 170 L20 90 Z" fill="#eff1fb" stroke="#d4ddff" strokeWidth="1.5" />

                  {/* Tier 1 Server Bay */}
                  <g transform="translate(70, 50)">
                    <path d="M100 0 L180 45 L100 90 L20 45 Z" fill="#ffffff" stroke="#1c3fc4" strokeWidth="1.5" />
                    <path d="M20 45 L100 90 L100 115 L20 70 Z" fill="#1c3fc4" />
                    <path d="M100 90 L180 45 L180 70 L100 115 Z" fill="#1230a0" />
                    <circle cx="55" cy="58" r="2.5" fill="#60a5fa" />
                    <circle cx="65" cy="63" r="2.5" fill="#34d399" />
                    <circle cx="75" cy="68" r="2.5" fill="#60a5fa" />
                  </g>

                  {/* Tier 2 Object Storage Bay */}
                  <g transform="translate(70, 20)">
                    <path d="M100 0 L180 45 L100 90 L20 45 Z" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.5" />
                    <path d="M20 45 L100 90 L100 115 L20 70 Z" fill="#2563eb" />
                    <path d="M100 90 L180 45 L180 70 L100 115 Z" fill="#1d4ed8" />
                    <circle cx="55" cy="58" r="2.5" fill="#93c5fd" />
                    <circle cx="65" cy="63" r="2.5" fill="#34d399" />
                    <circle cx="75" cy="68" r="2.5" fill="#93c5fd" />
                  </g>

                  {/* Telemetry Indicator 1 */}
                  <g transform="translate(25, 35)">
                    <rect x="0" y="0" width="80" height="24" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="40" y="15" fill="#1c3fc4" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">Rp 400 / GB</text>
                  </g>

                  {/* Telemetry Indicator 2 */}
                  <g transform="translate(235, 45)">
                    <rect x="0" y="0" width="80" height="24" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="40" y="15" fill="#131a1b" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">HTTPS Encrypted</text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Bottom 3-Part Floating Card */}
            <div className="bg-white border-t border-[#d9dfe0] p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Left Action */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-[4px] bg-[#1c3fc4] text-white font-sans font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-[#1230a0] transition-all w-full sm:w-auto"
                >
                  Hitung Estimasi Biaya
                </a>
                <span className="text-[11px] font-sans text-[#5e7277] mt-1.5 font-medium">
                  Daftar akun tanpa komitmen kaku
                </span>
              </div>

              {/* Center Quote */}
              <div className="md:border-x md:border-[#d9dfe0] px-0 md:px-4 py-2 md:py-0 text-center">
                <p className="text-xs sm:text-sm font-sans font-bold text-[#131a1b]">
                  “Bayar tepat sebesar gigabyte yang Anda simpan”
                </p>
                <span className="text-[11px] font-mono text-[#5e7277] block mt-0.5">
                  - Skema Rp 400 / GB
                </span>
              </div>

              {/* Right Action */}
              <div className="text-center md:text-right">
                <p className="text-xs sm:text-sm font-sans font-bold text-[#131a1b]">
                  “Akses langsung di browser tanpa instalasi”
                </p>
                <button
                  type="button"
                  onClick={onOpenAboutModal}
                  className="text-[11px] font-sans text-[#1c3fc4] hover:underline mt-0.5 font-semibold cursor-pointer"
                >
                  - Pelajari profil pengembang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
