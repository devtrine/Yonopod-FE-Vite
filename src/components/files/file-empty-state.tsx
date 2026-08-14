import { Folder } from "lucide-react";
import { Button } from "../ui/button";

export function FileEmptyState({
  title = "No files yet",
  description = "Upload files or create folders to get started.",
  actionLabel,
  onAction,
  icon: Icon = Folder,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 bg-[#eff1fb] text-[#1c3fc4] rounded-full flex items-center justify-center mb-6">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-semibold text-[#0f172a] mb-2">{title}</h3>
      <p className="text-[#64748b] text-sm max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
