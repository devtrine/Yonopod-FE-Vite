"use client";

import { useState } from "react";
import { X, ChevronUp, Plus, Download } from "lucide-react";
import type { FileItem } from "./file-table";
import { FileTypeIcon } from "./file-type-icon";
import { Avatar } from "../ui/avatar";
import { TagChip } from "../tags/tag-chip";
import { TagPickerModal } from "../tags/tag-picker-modal";
import { Button } from "../ui/button";
import { useFile } from "../../hooks/use-files";
import { useUIStore } from "../../stores/ui-store";
import { formatFileSize } from "@/lib/formatters";
import type { FileMenuActions } from "./file-actions-menu";

export function FilePreview({
  item,
  onClose,
}: {
  item: FileItem | null;
  onClose: () => void;
}) {
  const [tagOpen, setTagOpen] = useState(false);
  const fileId = item && !item.isFolder ? Number(item.id) : null;
  const { data: file } = useFile(
    fileId !== null && Number.isFinite(fileId) ? fileId : undefined
  );
  const { openDownloadDialog } = useUIStore();

  const handleDownload: FileMenuActions["onDownload"] = (item) => {
    if (item.isFolder) return;
    openDownloadDialog(Number(item.id), item.name);
  };

  if (!item) return null;

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <aside className="fixed inset-y-0 right-0 z-50 flex flex-col h-full w-[85%] max-w-[320px] shrink-0 bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.1)] md:shadow-none md:border-l md:border-[#e2e8f0] md:relative overflow-y-auto animate-in slide-in-from-right-8 md:animate-none duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#e2e8f0]">
        <h3 className="text-base font-semibold text-[#0f172a]">Info / Preview</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9] transition-colors"
          aria-label="Close preview"
        >
          <X size={18} />
        </button>
      </div>

      {/* Preview Area */}
      <div className="p-4 border-b border-[#e2e8f0]">
        <div className="w-full aspect-4/3 rounded-lg bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center mb-3">
          <FileTypeIcon name={item.name} isFolder={item.isFolder} size={64} />
        </div>
        <div className="flex items-center gap-2">
          <FileTypeIcon name={item.name} isFolder={item.isFolder} size={16} />
          <p className="font-semibold text-[#0f172a] truncate" title={item.name}>
            {item.name}
          </p>
        </div>
        {!item.isFolder && (
          <Button
            onClick={() => handleDownload(item)}
            className="mt-3 w-full"
          >
            <Download size={16} />
            Download
          </Button>
        )}
      </div>

      {/* Details Section */}
      <div className="p-4 border-b border-[#e2e8f0]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-[#0f172a]">Details</h4>
          <ChevronUp size={16} className="text-[#64748b]" />
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
            <span className="text-[#64748b]">Type</span>
            <span className="text-[#0f172a]">{file?.extension || "—"}</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
            <span className="text-[#64748b]">Size</span>
            <span className="text-[#0f172a]">
              {file?.size ? formatFileSize(Number(file.size)) : "—"}
            </span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
            <span className="text-[#64748b]">Location</span>
            <span className="text-[#1c3fc4] hover:underline cursor-pointer">
              {item.location ?? "My Drive"}
            </span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
            <span className="text-[#64748b]">Modified</span>
            <span className="text-[#0f172a]">{item.lastModified ?? "—"}</span>
          </div>
        </div>
      </div>

      {/* Tags Section */}
      {!item.isFolder && (
        <div className="p-4 border-b border-[#e2e8f0]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-[#0f172a]">Tags</h4>
            <button
              onClick={() => setTagOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-[#1c3fc4] hover:bg-[#eff4ff] transition-colors"
            >
              <Plus size={13} />
              Manage
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {file?.tags && file.tags.length > 0 ? (
              file.tags.map((tag) => <TagChip key={tag.id} tag={tag} />)
            ) : (
              <p className="text-sm text-[#64748b]">No tags.</p>
            )}
          </div>
        </div>
      )}

      {/* Sharing Section
      <div className="p-4 border-b border-[#e2e8f0]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-[#0f172a]">Sharing</h4>
          <ChevronUp size={16} className="text-[#64748b]" />
        </div>
        
        <div className="text-sm">
          <p className="text-[#64748b] mb-2">Shared with</p>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <Avatar name="Sarah Jenkins" size="sm" className="border-2 border-white" />
              <Avatar name="David Chen" size="sm" className="border-2 border-white" />
            </div>
            <span className="text-[#0f172a]">Team Alpha +2</span>
          </div>
        </div>
      </div> */}

      {/* Activity Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-[#0f172a]">Activity</h4>
          <ChevronUp size={16} className="text-[#64748b]" />
        </div>
        
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#f1f5f9] flex shrink-0 items-center justify-center text-[#64748b] mt-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
              </div>
              <div>
                <p className="text-sm text-[#0f172a]">You edited this item</p>
                <p className="text-xs text-[#64748b]">Oct 25, 2:30 PM</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#eff1fb] flex shrink-0 items-center justify-center text-[#1c3fc4] mt-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <p className="text-sm text-[#0f172a]">Shared with Team Alpha</p>
                <p className="text-xs text-[#64748b]">Oct 24, 10:15 AM</p>
              </div>
            </div>
          </div>
        </div>

      {/* Tags Modal */}
      {!item.isFolder && (
        <TagPickerModal
          open={tagOpen}
          fileId={fileId ?? 0}
          onClose={() => setTagOpen(false)}
        />
      )}
    </aside>
    </>
  );
}
