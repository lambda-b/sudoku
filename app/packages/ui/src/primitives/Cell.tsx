import { clsx } from "clsx";
import {
  type KeyboardEvent,
  type LabelHTMLAttributes,
  useEffect,
  useRef,
} from "react";

export type CellProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  "onChange" | "onFocus" | "onKeyDown"
> & {
  ariaLabel: string;
  disabled?: boolean;
  focused?: boolean;
  inputMode?: "none" | "numeric" | "text";
  onFocus?: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onValueChange: (value: string) => void;
  readOnly?: boolean;
  value: string;
};

export const Cell = ({
  ariaLabel,
  className,
  disabled = false,
  focused = false,
  inputMode = "none",
  onFocus,
  onKeyDown,
  onValueChange,
  readOnly = false,
  value,
  ...props
}: CellProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      focused &&
      inputRef.current &&
      document.activeElement !== inputRef.current
    ) {
      inputRef.current.focus();
    }
  }, [focused]);

  return (
    <label
      className={clsx(
        "block h-full w-full cursor-pointer text-center focus-within:shadow-[0_0_10px_hsl(207_61%_53%)]",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
      {...props}
    >
      <input
        aria-label={ariaLabel}
        className="sr-only"
        inputMode={inputMode}
        onChange={(event) => {
          const nextValue = event.target.value.slice(-1);
          onValueChange(nextValue);
        }}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        pattern="[0-9]*"
        readOnly={readOnly || disabled}
        ref={inputRef}
        value={value}
      />
      {value}
    </label>
  );
};
