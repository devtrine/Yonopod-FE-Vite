import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#1c3fc4] text-white hover:bg-[#1230a0] active:bg-[#0f2690] shadow-sm",
  secondary:
    "bg-[#eff1fb] text-[#1c3fc4] hover:bg-[#e0e4f8] active:bg-[#d1d8f5]",
  ghost:
    "bg-transparent text-[#64748b] hover:bg-[#f1f5f9] active:bg-[#e2e8f0]",
  danger:
    "bg-[#ef4444] text-white hover:bg-[#dc2626] active:bg-[#b91c1c] shadow-sm",
  outline:
    "bg-white text-[#0f172a] border border-[#e2e8f0] hover:bg-[#f8fafc] active:bg-[#f1f5f9] shadow-sm",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-10 px-5 text-sm gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled,
  ...props
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c3fc4] select-none whitespace-nowrap",
        variantStyles[variant],
        sizeStyles[size],
        disabled ? "opacity-50 pointer-events-none" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
