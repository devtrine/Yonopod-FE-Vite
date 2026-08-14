import { Outlet } from "react-router-dom";
import { RedirectIfAuthenticated } from "@/components/auth/redirect-if-authenticated";

export function AuthLayout() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#f7f9fb] font-sans">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#dbe1ff] opacity-30 blur-[60px]"
      />
      <div className="relative flex w-full flex-1 grow items-center justify-center p-6">
        <RedirectIfAuthenticated>
          <Outlet />
        </RedirectIfAuthenticated>
      </div>
    </main>
  );
}
