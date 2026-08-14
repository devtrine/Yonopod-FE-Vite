import { FileText } from "lucide-react";
import { FileTable, type FileItem } from "../files/file-table";

export function SearchResults({
  files,
  isLoading,
  isError,
  query,
}: {
  files: FileItem[];
  isLoading: boolean;
  isError: boolean;
  query: string;
}) {
  if (isLoading) {
    return <div className="h-48 rounded-xl bg-[#f1f5f9] animate-pulse" />;
  }

  if (isError) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-red-600">Failed to search files. Please try again.</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="py-12 text-center bg-white rounded-xl border border-[#e2e8f0]">
        <FileText size={32} className="mx-auto text-[#94a3b8] mb-3" />
        <p className="text-sm font-medium text-[#0f172a]">No matching files found</p>
        <p className="text-xs text-[#64748b] mt-1">
          {query
            ? `No results for "${query}". Try another keyword.`
            : "Enter a search term above."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-3">
        Found {files.length} result(s)
      </p>
      <FileTable files={files} columns={["name", "starred", "lastModified", "owner", "tags"]} />
    </div>
  );
}
