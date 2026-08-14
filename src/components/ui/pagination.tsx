import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  itemLabel = "entries",
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  itemLabel?: string;
}) {
  const start = totalItems ? (page - 1) * (itemsPerPage ?? 10) + 1 : null;
  const end = totalItems ? Math.min(page * (itemsPerPage ?? 10), totalItems) : null;

  const pages = getPaginationRange(page, totalPages);

  return (
    <div className="flex items-center justify-between gap-4 px-1">
      {/* Label */}
      {totalItems != null && start != null && end != null ? (
        <p className="text-sm text-[#64748b] flex-shrink-0">
          Showing {start} to {end} of {totalItems} {itemLabel}
        </p>
      ) : (
        <div />
      )}

      {/* Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-sm text-[#94a3b8]">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              aria-current={p === page ? "page" : undefined}
              className={[
                "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                p === page
                  ? "bg-[#1c3fc4] text-white"
                  : "text-[#0f172a] hover:bg-[#f1f5f9]",
              ].join(" ")}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function getPaginationRange(current: number, total: number): (number | "...")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "...", total];
  if (current >= total - 2) return [1, "...", total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}
