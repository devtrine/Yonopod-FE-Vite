import { Play } from "lucide-react";

export function FileTypeIcon({
  name,
  isFolder = false,
  size = 54,
  thumbnailUrl,
  className = "",
}: {
  name: string;
  isFolder?: boolean;
  size?: number;
  thumbnailUrl?: string | null;
  className?: string;
}) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";

  // 1. Folder icon (Windows / Modern folder style)
  if (isFolder) {
    return (
      <div
        style={{ width: size, height: size }}
        className={["flex items-center justify-center relative flex-shrink-0 select-none", className].join(" ")}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Windows-style folder shape */}
          <path
            d="M4 12C4 9.79086 5.79086 8 8 8H18.3431C19.404 8 20.4214 8.42143 21.1716 9.17157L24 12H40C42.2091 12 44 13.7909 44 16V36C44 38.2091 42.2091 40 40 40H8C5.79086 40 4 38.2091 4 36V12Z"
            fill="#FFA000"
          />
          <path
            d="M4 17C4 14.7909 5.79086 13 8 13H40C42.2091 13 44 14.7909 44 17V36C44 38.2091 42.2091 40 40 40H8C5.79086 40 4 38.2091 4 36V17Z"
            fill="#FFCA28"
          />
          {/* Subtle inner document preview */}
          <rect x="10" y="16" width="28" height="2" rx="1" fill="#FFE082" opacity="0.6" />
        </svg>
      </div>
    );
  }

  // 2. Real Image / Video thumbnail if URL available
  if (thumbnailUrl) {
    const isVideo = ["mp4", "webm", "mov", "avi", "mkv"].includes(ext);
    return (
      <div
        style={{ width: size, height: size }}
        className={["relative flex items-center justify-center rounded-lg overflow-hidden bg-neutral-900 border border-neutral-700/50 shadow-sm flex-shrink-0 select-none", className].join(" ")}
      >
        <img
          src={thumbnailUrl}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {isVideo && (
          <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-xs">
            <Play size={8} className="fill-white translate-x-[0.5px]" />
          </div>
        )}
      </div>
    );
  }

  // 3. Image file without thumbnail (PNG, JPG, SVG, etc.)
  if (["png", "jpg", "jpeg", "gif", "webp", "bmp", "ico"].includes(ext)) {
    return (
      <div
        style={{ width: size, height: size }}
        className={["relative flex items-center justify-center rounded-lg bg-neutral-900 border border-neutral-800 shadow-sm flex-shrink-0 select-none", className].join(" ")}
      >
        {/* Photo thumbnail mockup */}
        <svg
          width={size * 0.7}
          height={size * 0.7}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="2" y="2" width="20" height="20" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <circle cx="8" cy="8" r="2" fill="#38bdf8" />
          <path d="M4 18L9 12L14 17L17 13L20 17V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V18Z" fill="#0284c7" />
        </svg>
      </div>
    );
  }

  // 4. Video file without thumbnail (MP4, WEBM, MOV)
  if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext)) {
    return (
      <div
        style={{ width: size, height: size }}
        className={["relative flex items-center justify-center rounded-lg bg-neutral-900 border border-neutral-800 shadow-sm flex-shrink-0 select-none", className].join(" ")}
      >
        {/* Video frame mockup */}
        <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="3" width="20" height="18" rx="2" fill="#1e1e2e" stroke="#374151" strokeWidth="1" />
          <line x1="2" y1="7" x2="22" y2="7" stroke="#374151" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="2" y1="17" x2="22" y2="17" stroke="#374151" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
        {/* Purple circle play badge on bottom-right (as in user screenshot) */}
        <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xs">
          <Play size={8} className="fill-white translate-x-[0.5px]" />
        </div>
      </div>
    );
  }

  // 5. PDF or HTML (Chrome-style document icon as seen in screenshot)
  if (["pdf", "html", "htm"].includes(ext)) {
    return (
      <div
        style={{ width: size, height: size }}
        className={["relative flex items-center justify-center flex-shrink-0 select-none", className].join(" ")}
      >
        {/* Document with folded top-right corner and Chrome badge */}
        <svg
          width={size * 0.82}
          height={size}
          viewBox="0 0 36 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* White sheet with folded corner */}
          <path
            d="M3 4C3 2.34315 4.34315 1 6 1H24L33 10V40C33 41.6569 31.6569 43 30 43H6C4.34315 43 3 41.6569 3 40V4Z"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />
          {/* Fold flap */}
          <path d="M24 1V10H33" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
          
          {/* Chrome Logo Icon centered on the sheet */}
          <g transform="translate(9, 16) scale(0.75)">
            <circle cx="12" cy="12" r="11" fill="#EA4335" />
            <path d="M12 1L21.5 17.5H12V1Z" fill="#FBBC05" />
            <path d="M12 1L2.5 17.5H12V1Z" fill="#34A853" />
            <circle cx="12" cy="12" r="6" fill="#FFFFFF" />
            <circle cx="12" cy="12" r="4.5" fill="#4285F4" />
          </g>
        </svg>
      </div>
    );
  }

  // 6. Drawio / SVG Flowchart document
  if (["drawio", "svg"].includes(ext) || name.includes(".drawio.")) {
    return (
      <div
        style={{ width: size, height: size }}
        className={["relative flex items-center justify-center flex-shrink-0 select-none", className].join(" ")}
      >
        <svg
          width={size * 0.82}
          height={size}
          viewBox="0 0 36 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 4C3 2.34315 4.34315 1 6 1H24L33 10V40C33 41.6569 31.6569 43 30 43H6C4.34315 43 3 41.6569 3 40V4Z"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />
          <path d="M24 1V10H33" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Flowchart icon */}
          <rect x="8" y="15" width="8" height="6" rx="1" fill="#F97316" />
          <rect x="20" y="25" width="8" height="6" rx="1" fill="#F97316" />
          <path d="M12 21V28H20" stroke="#F97316" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  // 7. DOC / DOCX / Text document
  if (["doc", "docx", "rtf", "odt", "txt", "md"].includes(ext)) {
    return (
      <div
        style={{ width: size, height: size }}
        className={["relative flex items-center justify-center flex-shrink-0 select-none", className].join(" ")}
      >
        <svg
          width={size * 0.82}
          height={size}
          viewBox="0 0 36 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 4C3 2.34315 4.34315 1 6 1H24L33 10V40C33 41.6569 31.6569 43 30 43H6C4.34315 43 3 41.6569 3 40V4Z"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />
          <path d="M24 1V10H33" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Word / Document badge */}
          <rect x="7" y="16" width="14" height="14" rx="2" fill="#2563EB" />
          <text x="14" y="27" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            W
          </text>
        </svg>
      </div>
    );
  }

  // 8. Executable / App (.exe, .msi, .dmg)
  if (["exe", "msi", "dmg", "app", "bat", "cmd"].includes(ext)) {
    return (
      <div
        style={{ width: size, height: size }}
        className={["relative flex items-center justify-center flex-shrink-0 select-none", className].join(" ")}
      >
        <div className="w-[85%] h-[85%] rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
          <span className="text-white font-black text-xs tracking-tighter">APP</span>
        </div>
      </div>
    );
  }

  // 9. Spreadsheets (XLSX, CSV)
  if (["xls", "xlsx", "csv", "ods"].includes(ext)) {
    return (
      <div
        style={{ width: size, height: size }}
        className={["relative flex items-center justify-center flex-shrink-0 select-none", className].join(" ")}
      >
        <svg width={size * 0.82} height={size} viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 4C3 2.34315 4.34315 1 6 1H24L33 10V40C33 41.6569 31.6569 43 30 43H6C4.34315 43 3 41.6569 3 40V4Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <path d="M24 1V10H33" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="7" y="16" width="14" height="14" rx="2" fill="#16A34A" />
          <text x="14" y="27" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">X</text>
        </svg>
      </div>
    );
  }

  // 10. Default / Generic Document
  return (
    <div
      style={{ width: size, height: size }}
      className={["relative flex items-center justify-center flex-shrink-0 select-none", className].join(" ")}
    >
      <svg
        width={size * 0.82}
        height={size}
        viewBox="0 0 36 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 4C3 2.34315 4.34315 1 6 1H24L33 10V40C33 41.6569 31.6569 43 30 43H6C4.34315 43 3 41.6569 3 40V4Z"
          fill="#FFFFFF"
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />
        <path d="M24 1V10H33" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
        <line x1="8" y1="18" x2="22" y2="18" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="24" x2="28" y2="24" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="30" x2="20" y2="30" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
