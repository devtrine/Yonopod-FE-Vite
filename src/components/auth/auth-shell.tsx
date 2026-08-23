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
      <header className="relative flex w-full flex-col items-center gap-1">
        <h1 className="relative text-center text-2xl font-bold tracking-tight text-[#004ac6]">
          Yonopod
        </h1>
        <p className="relative whitespace-nowrap text-center text-xs font-medium text-slate-500">
          By devtrine suported by <a href="https://www.anext.dev/">anext.dev</a>
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
