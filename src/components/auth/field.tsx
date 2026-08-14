import type { InputHTMLAttributes, ReactNode } from "react";

export function Field({
  id,
  label,
  right,
  icon,
  endIcon,
  ...inputProps
}: {
  id: string;
  label: string;
  right?: ReactNode;
  icon: ReactNode;
  endIcon?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex w-full flex-col items-start gap-1">
      <div className="flex w-full items-center justify-between">
        <label
          htmlFor={id}
          className="relative text-xs font-semibold leading-4 tracking-wider text-[#434655]"
        >
          {label}
        </label>
        {right}
      </div>
      <div className="relative w-full">
        <div className="flex w-full items-center rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all">
          <input
            id={id}
            className="relative grow border-none bg-transparent p-0 text-sm font-normal text-slate-800 outline-none placeholder:text-slate-400"
            {...inputProps}
          />
          {endIcon ? <div className="ml-2 flex items-center">{endIcon}</div> : null}
        </div>
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
