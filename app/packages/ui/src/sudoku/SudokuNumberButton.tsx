import { Button } from "@sudoku/ui/primitives/Button";
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
    <Button
      className={clsx(
        "h-[var(--sudoku-cell)] w-[var(--sudoku-cell)] border-[#b5b5b5] text-center [font-size:calc(var(--sudoku-cell)*0.5714)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      disabled={disabled}
      onClick={() => onNumberSelect(number)}
      text={number}
    />
  );
};

export const SudokuNumberButton = memo(SudokuNumberButtonComponent);
