import { MoreHorizontal, Star } from "lucide-react";
import { FileTypeIcon } from "./file-type-icon";
import { FileActionsMenu, type FileMenuActions } from "./file-actions-menu";
import type { FileItem } from "./file-table";

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
  const fullName = item.name + (item.extension ? "." + item.extension : "");

  return (
    <div
      onClick={() => onClick?.(item)}
      onContextMenu={(e) => {
        if (onMenuClick) {
          e.preventDefault();
          onMenuClick(item);
        }
      }}
      title={fullName}
      className={[
        "group relative flex flex-col items-center justify-start w-[92px] p-1.5 rounded-lg transition-colors cursor-pointer select-none",
        "hover:bg-blue-500/10 hover:ring-1 hover:ring-blue-400/30 focus:bg-blue-500/20 focus:ring-1 focus:ring-blue-500/50",
        item.isSelected ? "bg-blue-500/20 ring-1 ring-blue-500/50" : "",
      ].join(" ")}
    >
      {/* Star / Favorite small badge */}
      {item.isStarred && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar?.(item);
          }}
          title="Toggle favorite"
          className="absolute top-1 right-1 z-10 p-0.5 rounded hover:scale-110 transition-transform"
        >
          <Star size={12} className="fill-amber-400 text-amber-400" />
        </button>
      )}

      {/* Action Menu (accessible on hover) */}
      {menuActions ? (
        <div className="absolute top-1 left-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <FileActionsMenu
            item={item}
            triggerClassName="w-5 h-5 bg-white/90 dark:bg-neutral-800/90 shadow-xs text-neutral-600 hover:text-neutral-900 rounded flex items-center justify-center"
            {...menuActions}
          />
        </div>
      ) : onMenuClick ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick(item);
          }}
          aria-label="More options"
          className="absolute top-1 left-1 z-10 opacity-0 group-hover:opacity-100 w-5 h-5 bg-white/90 dark:bg-neutral-800/90 shadow-xs text-neutral-600 hover:text-neutral-900 rounded flex items-center justify-center transition-all"
        >
          <MoreHorizontal size={12} />
        </button>
      ) : null}

      {/* File Icon Centered */}
      <div className="w-[54px] h-[54px] flex items-center justify-center flex-shrink-0 mt-1">
        <FileTypeIcon
          name={fullName}
          isFolder={item.isFolder}
          size={50}
        />
      </div>

      {/* File Name Centered under Icon */}
      <p
        className="w-full text-center text-[11px] leading-tight text-neutral-800 dark:text-neutral-200 mt-1.5 px-0.5 line-clamp-2 break-words"
        style={{
          wordBreak: "break-word",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {fullName}
      </p>
    </div>
  );
}
