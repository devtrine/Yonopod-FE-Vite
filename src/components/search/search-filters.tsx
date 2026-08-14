import { Filter } from "lucide-react";

export function SearchFilters({
  typeFilter,
  onTypeFilterChange,
}: {
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Filter size={16} className="text-[#64748b]" />
      <select
        value={typeFilter}
        onChange={(e) => onTypeFilterChange(e.target.value)}
        className="px-3 py-1.5 rounded-lg border border-[#e2e8f0] text-xs font-medium text-[#0f172a] bg-white"
      >
        <option value="all">All File Types</option>
        <option value="images">Images</option>
        <option value="documents">Documents</option>
        <option value="videos">Videos</option>
      </select>
    </div>
  );
}
