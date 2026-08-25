import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FileItem } from "./file-table";
import type { FileMenuActions } from "./file-actions-menu";
import { FileCard } from "./file-card";
import { groupFilesByDate } from "@/lib/date-grouping";

export function FileGrid({
  items,
  grouped = false,
  onItemClick,
  onMenuClick,
  menuActions,
  onToggleStar,
}: {
  items: FileItem[];
  grouped?: boolean;
  onItemClick?: (item: FileItem) => void;
  onMenuClick?: (item: FileItem) => void;
  menuActions?: FileMenuActions;
  onToggleStar?: (item: FileItem) => void;
}) {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (grouped) {
    const groups = groupFilesByDate(items);
    return (
      <div className="flex flex-col gap-6 select-none">
        {groups.map((group) => {
          const isCollapsed = collapsedGroups[group.key];
          return (
            <div key={group.key} className="flex flex-col gap-2.5">
              {/* Group Title Accordion Header */}
              <button
                type="button"
                onClick={() => toggleGroup(group.key)}
                className="flex items-center gap-1.5 w-fit text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors focus:outline-none cursor-pointer group"
              >
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 text-neutral-500 group-hover:text-neutral-800 ${
                    isCollapsed ? "-rotate-90" : ""
                  }`}
                  strokeWidth={2}
                />
                <span>{group.label}</span>
                <span className="text-[11px] font-normal text-neutral-400">
                  ({group.files.length})
                </span>
              </button>

              {/* Grid of File Tiles */}
              {!isCollapsed && (
                <div className="flex flex-wrap gap-2.5 sm:gap-3.5 items-start pl-1">
                  {group.files.map((item) => (
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
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2.5 sm:gap-3.5 items-start select-none pl-1">
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
