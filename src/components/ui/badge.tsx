type BadgeVariant = "success" | "danger" | "warning" | "info" | "neutral";

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-[#dcfce7] text-[#16a34a]",
  danger: "bg-[#fee2e2] text-[#dc2626]",
  warning: "bg-[#fef9c3] text-[#ca8a04]",
  info: "bg-[#dbeafe] text-[#2563eb]",
  neutral: "bg-[#f1f5f9] text-[#64748b]",
};

const dotStyles: Record<BadgeVariant, string> = {
  success: "bg-[#22c55e]",
  danger: "bg-[#ef4444]",
  warning: "bg-[#f59e0b]",
  info: "bg-[#3b82f6]",
  neutral: "bg-[#94a3b8]",
};

export function Badge({
  variant = "neutral",
  children,
  showDot = true,
  className = "",
}: {
  variant?: BadgeVariant;
  children: React.ReactNode;
  showDot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showDot && (
        <span
          className={["w-1.5 h-1.5 rounded-full flex-shrink-0", dotStyles[variant]].join(" ")}
        />
      )}
      {children}
    </span>
  );
}
