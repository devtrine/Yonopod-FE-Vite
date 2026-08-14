import type { FileItem } from "./file-table";
import type { FileMenuActions } from "./file-actions-menu";
import { FileCard } from "./file-card";

export function FileGrid({
  items,
  onItemClick,
  onMenuClick,
  menuActions,
  onToggleStar,
}: {
  items: FileItem[];
  onItemClick?: (item: FileItem) => void;
  onMenuClick?: (item: FileItem) => void;
  menuActions?: FileMenuActions;
  onToggleStar?: (item: FileItem) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <FileCard
          key={item.id}
          item={item}
          onClick={onItemClick}
          onMenuClick={onMenuClick}
          menuActions={menuActions}
          onToggleStar={onToggleStar}
        />
      ))}
    </div>
  );
}
