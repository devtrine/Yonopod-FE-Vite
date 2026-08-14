"use client";

import { FileTable, type FileItem } from "./file-table";

export function FileList({
  files,
  onRowClick,
  onMenuClick,
  onSelect,
  onSelectAll,
  selectedIds,
  isAllSelected,
}: {
  files: FileItem[];
  onRowClick?: (file: FileItem) => void;
  onMenuClick?: (file: FileItem) => void;
  onSelect?: (id: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  selectedIds?: string[];
  isAllSelected?: boolean;
}) {
  return (
    <FileTable
      files={files}
      onRowClick={onRowClick}
      onMenuClick={onMenuClick}
      showCheckbox
      onSelect={onSelect}
      onSelectAll={onSelectAll}
      selectedIds={selectedIds}
      isAllSelected={isAllSelected}
    />
  );
}
