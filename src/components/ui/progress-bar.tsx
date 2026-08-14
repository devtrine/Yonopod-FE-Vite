export function ProgressBar({
  value,
  max = 100,
  variant = "default",
  size = "md",
  showLabel = false,
  className = "",
}: {
  value: number;
  max?: number;
  variant?: "default" | "danger" | "warning";
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  const trackColor = "bg-[#e2e8f0]";
  const fillColor =
    variant === "danger"
      ? "bg-[#ef4444]"
      : variant === "warning"
        ? "bg-[#f59e0b]"
        : "bg-[#1c3fc4]";

  const heightClass = size === "sm" ? "h-1" : "h-1.5";

  return (
    <div className={["flex flex-col gap-1 w-full", className].filter(Boolean).join(" ")}>
      {showLabel && (
        <span className="text-xs text-[#64748b]">
          {Math.round(percent)}%
        </span>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={["w-full rounded-full overflow-hidden", trackColor, heightClass].join(" ")}
      >
        <div
          className={["h-full rounded-full transition-all duration-300", fillColor].join(" ")}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
