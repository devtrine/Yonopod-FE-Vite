import { useRef, useEffect, useState, Fragment } from "react";
import { Star, ChevronDown } from "lucide-react";
import { FileTypeIcon } from "./file-type-icon";
import { FileActionsMenu, type FileMenuActions } from "./file-actions-menu";
import { TagChip } from "@/components/tags/tag-chip";
import { groupFilesByDate } from "@/lib/date-grouping";
import type { Tag } from "@/types/tags";

export type FileItem = {
  id: string;
  name: string;
  isFolder?: boolean;
  lastModified?: string;
  rawDate?: string | Date;
  extension?: string;
  owner?: string;
  tags?: Tag[];
  location?: string;
  isStarred?: boolean;
  isSelected?: boolean;
  size?: number | null;
};

export type Column = "name" | "lastModified" | "owner" | "location" | "dateDeleted" | "originalLocation" | "starred" | "tags";

export function FileTable({
  files,
  columns = ["name", "lastModified", "owner"],
  onSelect,
  onSelectAll,
  onRowClick,
  onToggleStar,
  menuActions,
  selectedIds = [],
  isAllSelected = false,  
  showCheckbox = false,
  hideActions = false,
  emptyState,
  grouped = false,
}: {
  files: FileItem[];
  columns?: Column[];
  onSelect?: (id: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  onRowClick?: (file: FileItem) => void;
  onMenuClick?: (file: FileItem) => void;
  onToggleStar?: (file: FileItem) => void;
  menuActions?: FileMenuActions;
  selectedIds?: string[];
  isAllSelected?: boolean;
  showCheckbox?: boolean;
  hideActions?: boolean;
  emptyState?: React.ReactNode;
  grouped?: boolean;
}) {
  const [, setHoveredId] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  
  // Ref untuk mengatur tampilan indeterminate (-) pada checkbox header
  const headerCheckboxRef = useRef<HTMLInputElement>(null);
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < files.length;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isPartiallySelected;
    }
  }, [isPartiallySelected]);

  const toggleGroup = (key: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const columnHeaders: Record<Column, string> = {
    name: "Name",
    lastModified: "Last Modified",
    owner: "Owner",
    location: "Location",
    dateDeleted: "Date Deleted",
    originalLocation: "Original Location",
    starred: "",
    tags: "Tags",
  };

  if (files.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  const totalColumns = (showCheckbox ? 1 : 0) + columns.length + (!hideActions ? 1 : 0);

  const renderRow = (file: FileItem) => {
    const isSelected = selectedIds.includes(file.id);
    return (
      <tr
        key={file.id}
        onMouseEnter={() => setHoveredId(file.id)}
        onMouseLeave={() => setHoveredId(null)}
        onClick={() => onRowClick?.(file)}
        className={[
          "group transition-colors",
          isSelected ? "bg-[#eff4ff]" : "hover:bg-[#f8fafc]",
          onRowClick ? "cursor-pointer" : "",
        ].join(" ")}
      >
        {/* Checkbox */}
        {showCheckbox && (
          <td className="px-4 py-3 w-10" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect?.(file.id, e.target.checked)}
              className="w-4 h-4 rounded border-[#cbd5e1] text-[#1c3fc4] cursor-pointer"
              aria-label={`Select ${file.name}`}
            />
          </td>
        )}

        {/* Columns */}
        {columns.map((col) => (
          <td key={col} className="px-4 py-3">
            {col === "name" && (
              <div className="flex items-center gap-3 min-w-0">
                <FileTypeIcon name={"." + (file.extension ?? ".bin")} isFolder={file.isFolder} size={20} />
                <span
                  className={[
                    "font-medium truncate",
                    isSelected ? "text-[#1c3fc4]" : "text-[#0f172a]",
                  ].join(" ")}
                >
                  {file.name + (file.extension ? "." + file.extension : "")}
                </span>
              </div>
            )}
            {col === "starred" && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar?.(file);
                }}
                aria-label={`${file.isStarred ? "Remove" : "Add"} ${file.name} ${file.isStarred ? "from" : "to"} favorites`}
                disabled={!onToggleStar}
                className="disabled:cursor-default"
              >
                <Star
                  size={16}
                  className={file.isStarred ? "fill-[#f59e0b] text-[#f59e0b]" : "text-[#e2e8f0]"}
                />
              </button>
            )}
            {col === "lastModified" && (
              <span className="text-[#64748b] whitespace-nowrap">{file.lastModified ?? "—"}</span>
            )}
            {col === "owner" && (
              <span className="text-[#64748b]">{file.owner ?? "—"}</span>
            )}
            {col === "location" && file.location && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#f1f5f9] text-xs text-[#64748b] font-medium uppercase tracking-wide whitespace-nowrap">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
                {file.location}
              </span>
            )}
            {col === "dateDeleted" && (
              <span className="text-[#64748b] whitespace-nowrap">{file.lastModified ?? "—"}</span>
            )}
            {col === "originalLocation" && (
              <span className="text-[#64748b] text-xs">{file.location ?? "—"}</span>
            )}
            {col === "tags" && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {file.tags && file.tags.length > 0 ? (
                  file.tags.map((tag) => <TagChip key={tag.id} tag={tag} />)
                ) : (
                  <span className="text-[#94a3b8]">—</span>
                )}
              </div>
            )}
          </td>
        ))}

        {/* Actions */}
        {!hideActions && (
          <td className="px-4 py-3 w-10" onClick={(e) => e.stopPropagation()}>
            {menuActions ? (
              <FileActionsMenu
                item={file}
                {...menuActions}
              />
            ) : null}
          </td>
        )}
      </tr>
    );
  };

  const groups = grouped ? groupFilesByDate(files) : [];

  return (
    <div className="w-full border border-[#e2e8f0] rounded-xl overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap" role="table">
          {/* Header */}
          <thead>
            <tr className="border-b border-[#e2e8f0] bg-white">
              {showCheckbox && (
                <th className="w-10 px-4 py-3">
                  <input
                    ref={headerCheckboxRef}
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    className="w-4 h-4 rounded border-[#cbd5e1] text-[#1c3fc4] cursor-pointer"
                    aria-label="Select all"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] tracking-wider uppercase whitespace-nowrap"
                >
                  {columnHeaders[col]}
                </th>
              ))}
              {!hideActions && <th className="w-10 px-4 py-3" />}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-[#f1f5f9]">
            {grouped ? (
              groups.map((group) => {
                const isCollapsed = collapsedGroups[group.key];
                return (
                  <Fragment key={group.key}>
                    <tr className="bg-[#f8fafc] border-t border-b border-[#e2e8f0]">
                      <td
                        colSpan={totalColumns}
                        className="px-4 py-2 text-xs font-semibold text-[#64748b] uppercase tracking-wider"
                      >
                        <button
                          type="button"
                          onClick={() => toggleGroup(group.key)}
                          className="flex items-center gap-2 hover:text-[#0f172a] transition-colors focus:outline-none cursor-pointer group"
                        >
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 text-[#94a3b8] group-hover:text-[#0f172a] ${
                              isCollapsed ? "-rotate-90" : ""
                            }`}
                          />
                          <span>{group.label}</span>
                          <span className="text-[#94a3b8] font-normal normal-case">
                            ({group.files.length})
                          </span>
                        </button>
                      </td>
                    </tr>
                    {!isCollapsed && group.files.map((file) => renderRow(file))}
                  </Fragment>
                );
              })
            ) : (
              files.map((file) => renderRow(file))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}