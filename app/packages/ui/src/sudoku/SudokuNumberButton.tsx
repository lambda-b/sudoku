import { clsx } from "clsx";
import { memo } from "react";

export interface SudokuNumberButtonProps {
  className?: string;
  disabled?: boolean;
  number: number;
  onNumberSelect: (cellNumber: number) => void;
}

const SudokuNumberButtonComponent = ({
  className = "",
  disabled = false,
  number,
  onNumberSelect,
}: SudokuNumberButtonProps) => {
  return (
    <div
      className={clsx(
        "h-[var(--sudoku-cell)] w-[var(--sudoku-cell)] border-[#b5b5b5]",
        className,
      )}
    >
      <button
        className="h-full w-full cursor-pointer text-center [font-size:calc(var(--sudoku-cell)*0.5714)] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        onClick={() => onNumberSelect(number)}
        type="button"
      >
        {number}
      </button>
    </div>
  );
};

export const SudokuNumberButton = memo(SudokuNumberButtonComponent);
