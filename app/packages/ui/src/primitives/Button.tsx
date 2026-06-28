import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonTone = "neutral" | "success" | "primary" | "danger";
type ButtonSize = "toolbar" | "default" | "small";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  size?: ButtonSize;
  tone?: ButtonTone;
};

const toneClasses: Record<ButtonTone, string> = {
  danger: "border-red-600 text-red-600 hover:bg-red-50",
  neutral: "border-zinc-600 text-zinc-700 hover:bg-zinc-50",
  primary: "border-cyan-600 text-cyan-600 hover:bg-cyan-50",
  success: "border-emerald-600 text-emerald-700 hover:bg-emerald-50",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "gap-2 px-4 py-2 font-medium",
  small: "gap-1.5 px-3 py-1.5 text-sm font-medium",
  toolbar:
    "gap-1 px-2 py-1.5 text-xs font-medium sm:gap-2 sm:px-4 sm:py-2 sm:text-base",
};

export const Button = ({
  children,
  className,
  size = "default",
  tone = "neutral",
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        "inline-flex cursor-pointer items-center rounded border transition-colors disabled:cursor-wait disabled:opacity-60",
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};
