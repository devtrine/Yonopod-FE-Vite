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
      <div className="flex flex-col gap-6">
        {groups.map((group) => {
          const isCollapsed = collapsedGroups[group.key];
          return (
            <div key={group.key} className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => toggleGroup(group.key)}
                className="flex items-center gap-2 w-fit text-xs font-semibold text-[#64748b] uppercase tracking-wider hover:text-[#0f172a] transition-colors focus:outline-none cursor-pointer group select-none"
              >
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 text-[#94a3b8] group-hover:text-[#0f172a] ${
                    isCollapsed ? "-rotate-90" : ""
                  }`}
                />
                <span>{group.label}</span>
                <span className="text-xs text-[#94a3b8] font-normal normal-case">
                  ({group.files.length})
                </span>
              </button>
              {!isCollapsed && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
