import { Link } from "react-router-dom";
import { HardDrive, ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-[#eff1fb] text-[#1c3fc4] flex items-center justify-center mb-6">
        <HardDrive size={36} />
      </div>
      <h1 className="text-3xl font-bold text-[#0f172a] mb-2">404 — Page Not Found</h1>
      <p className="text-sm text-[#64748b] max-w-sm mb-6">
        The page you are looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1c3fc4] text-white text-sm font-medium hover:bg-[#1636b0] transition-colors shadow-sm"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>
    </div>
  );
}
export default NotFoundPage;
