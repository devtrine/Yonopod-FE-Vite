import { FileText, Download } from "lucide-react";
import { Button } from "../ui/button";
import { formatFileSize } from "@/lib/formatters";
import type { File as ApiFile } from "../../types/file";

export function ShareFileView({
  file,
  canDownload,
  onDownload,
}: {
  file: ApiFile;
  canDownload: boolean;
  onDownload: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[#FDFEFF] rounded-2xl border border-[#e2e8f0] max-w-lg mx-auto text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-[#0F0A6B]/10 text-[#0F0A6B] flex items-center justify-center">
        <FileText size={32} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-[#0f172a] mb-1">{file.name}</h2>
        <p className="text-xs text-[#64748b]">
          {file.size ? formatFileSize(Number(file.size)) : (file.extension ? `.${file.extension.toUpperCase()}` : "File")}
        </p>
      </div>
      {canDownload && (
        <Button onClick={onDownload} className="mt-2 bg-[#0F0A6B] text-white hover:bg-[#161282]">
          <Download size={16} />
          Download File
        </Button>
      )}
    </div>
  );
}
