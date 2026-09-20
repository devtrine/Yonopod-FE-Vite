import { MoreHorizontal, Star } from "lucide-react";
import { FileTypeIcon } from "./file-type-icon";
import { FileActionsMenu, type FileMenuActions } from "./file-actions-menu";
import type { FileItem } from "./file-table";
import { TagChip } from "@/components/tags/tag-chip";
import { formatFileSize } from "@/lib/formatters";

export function FileCard({
  item,
  onClick,
  onMenuClick,
  menuActions,
  onToggleStar,
}: {
  item: FileItem;
  onClick?: (item: FileItem) => void;
  onMenuClick?: (item: FileItem) => void;
  menuActions?: FileMenuActions;
  onToggleStar?: (item: FileItem) => void;
}) {
  return (
    <div
      onClick={() => onClick?.(item)}
      className={[
        "group relative flex flex-col p-3.5 sm:p-5 border border-[#e2e8f0] bg-[#FDFEFF] hover:border-[#cbd5e1] hover:scale-98 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all",
        onClick ? "cursor-pointer" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between mb-2.5 sm:mb-4">
        <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-[#0F0A6B]/10">
          <FileTypeIcon name={item.name} isFolder={item.isFolder} size={18} />
        </div>
        <div className="flex items-center gap-1">
          {menuActions ? (
            <FileActionsMenu item={item} triggerClassName="opacity-100 sm:opacity-0 sm:group-hover:opacity-100" {...menuActions} />
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMenuClick?.(item);
              }}
              aria-label="More options"
              className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 w-8 h-8 flex items-center justify-center text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#64748b] transition-all -mr-1 -mt-1"
            >
              <MoreHorizontal size={18} />
            </button>
          )}
          {onToggleStar && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(item);
              }}
              aria-label={`${item.isStarred ? "Remove" : "Add"} ${item.name} ${item.isStarred ? "from" : "to"} favorites`}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#f59e0b] transition-all -mr-1 -mt-1"
            >
              <Star
                size={16}
                className={item.isStarred ? "fill-[#f59e0b] text-[#f59e0b]" : ""}
              />
            </button>
          )}          
        </div>
      </div>
      <div className="mt-auto">
        <h3 className="text-sm font-semibold text-[#0f172a] mb-2 truncate" title={item.name}>
          {item.name}
        </h3>
        {item.tags && item.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-2">
            {item.tags.slice(0, 3).map((tag, i) => (
              <TagChip key={i} tag={tag} />
            ))}
            {item.tags.length > 3 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#f1f5f9] text-[#64748b]">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}
        <p className="text-xs text-[#64748b] truncate">
          {[
            item.size != null && Number(item.size) > 0 ? formatFileSize(Number(item.size)) : null,
            item.lastModified ? `Updated ${item.lastModified}` : null,
          ]
            .filter(Boolean)
            .join(" • ")}
        </p>
      </div>
    </div>
  );
}
