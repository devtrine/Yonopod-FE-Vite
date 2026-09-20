import type { ReactNode } from "react";

export function AuthShell({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative flex w-full max-w-[400px] flex-col items-start gap-4 overflow-hidden rounded-2xl border border-solid border-slate-200 bg-white/90 p-5 sm:p-6 shadow-[0px_20px_40px_#0f172a1a] backdrop-blur-md">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-px top-px h-[calc(100%_-_2px)] w-[calc(100%_-_2px)] rounded-2xl border border-solid border-white/50"
      />
      <header className="relative flex w-full flex-col items-center gap-2 mb-1">
        <div className="bg-[#0F0A6B] px-4 py-2 rounded-xl shadow-xs flex items-center justify-center">
          <img
            src="/logo/yonopod_logo.png"
            alt="Yonopod"
            className="h-8 w-auto object-contain max-w-[160px]"
          />
        </div>
        <p className="relative whitespace-nowrap text-center text-xs font-medium text-slate-500">
          By devtrine supported by{" "}
          <a
            href="https://www.anext.dev/"
            target="_blank"
            rel="noreferrer"
            className="text-[#0F0A6B] hover:underline font-medium"
          >
            anext.dev
          </a>
        </p>
      </header>
      {children}
      {footer ? (
        <footer className="relative flex w-full flex-col items-center pt-1">
          {footer}
        </footer>
      ) : null}
    </div>
  );
}
