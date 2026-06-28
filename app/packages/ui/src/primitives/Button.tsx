import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: LucideIcon;
  text: ReactNode;
};

export const Button = ({
  className,
  icon,
  text,
  type = "button",
  ...props
}: ButtonProps) => {
  const Icon = icon;

  return (
    <button
      className={clsx("cursor-pointer", className)}
      type={type}
      {...props}
    >
      {Icon && (
        <Icon
          aria-hidden="true"
          className="h-[1em] w-[1em] shrink-0"
          strokeWidth={2}
        />
      )}
      {text}
    </button>
  );
};
