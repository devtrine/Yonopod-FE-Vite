const AVATAR_COLORS = [
  "bg-[#dbeafe] text-[#1d4ed8]",
  "bg-[#dcfce7] text-[#15803d]",
  "bg-[#fef9c3] text-[#854d0e]",
  "bg-[#fce7f3] text-[#9d174d]",
  "bg-[#ede9fe] text-[#6d28d9]",
  "bg-[#ffedd5] text-[#c2410c]",
];

function getColorIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % AVATAR_COLORS.length;
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

type AvatarSize = "xs" | "sm" | "md" | "lg";

const sizeStyles: Record<AvatarSize, string> = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-7 h-7 text-xs",
  md: "w-8 h-8 text-sm",
  lg: "w-10 h-10 text-base",
};

export function Avatar({
  name,
  src,
  size = "md",
  className = "",
}: {
  name: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
}) {
  const colorClass = AVATAR_COLORS[getColorIndex(name)];
  const initials = getInitials(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={[
          "rounded-full object-cover flex-shrink-0",
          sizeStyles[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    );
  }

  return (
    <span
      aria-label={name}
      className={[
        "rounded-full flex items-center justify-center font-semibold flex-shrink-0 select-none",
        sizeStyles[size],
        colorClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {initials}
    </span>
  );
}
