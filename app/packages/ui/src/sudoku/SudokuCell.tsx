import type { SudokuUiCell } from "@sudoku/ui/sudoku/types";
import { clsx } from "clsx";
import { type ChangeEvent, memo, useEffect, useRef } from "react";

export interface SudokuCellProps {
  cell: SudokuUiCell;
  className?: string;
  disabled?: boolean;
  isSelected: boolean;
  onCellNumberChange: (address: number, cellNumber: number) => void;
  onCellSelect: (address: number) => void;
}

const SudokuCellComponent = ({
  cell,
  className = "",
  disabled = false,
  isSelected,
  onCellNumberChange,
  onCellSelect,
}: SudokuCellProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { address, cellNumber, initialCellNumber, status } = cell;
  const isGiven = initialCellNumber !== 0;
  const editable = !isGiven && !disabled;

  const updateCellNumber = (cellNumber: number) =>
    editable && onCellNumberChange(address, cellNumber);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, "").slice(-1);
    updateCellNumber(value ? Number(value) : 0);
  };

  useEffect(() => {
    if (
      isSelected &&
      inputRef.current &&
      document.activeElement !== inputRef.current
    ) {
      inputRef.current.focus();
    }
  }, [isSelected]);

  return (
    <div
      className={clsx(
        "h-[var(--sudoku-cell)] w-[var(--sudoku-cell)] border-[#b5b5b5]",
        className,
      )}
    >
      <label
        className={clsx(
          "block h-full w-full cursor-pointer text-center [font-size:calc(var(--sudoku-cell)*0.5714)] [line-height:var(--sudoku-cell)]",
          isGiven && "font-bold text-zinc-900",
          status === "conflict" && "bg-red-100 text-red-700",
          isSelected && "shadow-[0_0_10px_hsl(207_61%_53%)]",
          !editable && !isGiven && "cursor-not-allowed opacity-60",
        )}
        onDoubleClick={() => updateCellNumber(0)}
      >
        <input
          aria-label={`Sudoku cell ${address + 1}`}
          className="sr-only"
          inputMode="none"
          onChange={handleChange}
          onFocus={() => onCellSelect(address)}
          onKeyDown={(event) => {
            if (event.key === "Backspace" || event.key === "Delete") {
              event.preventDefault();
              updateCellNumber(0);
              return;
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              onCellSelect(address < 9 ? address : address - 9);
              return;
            }

            if (event.key === "ArrowDown") {
              event.preventDefault();
              onCellSelect(address + 9 > 80 ? address : address + 9);
              return;
            }

            if (event.key === "ArrowLeft") {
              event.preventDefault();
              onCellSelect(address % 9 === 0 ? address : address - 1);
              return;
            }

            if (event.key === "ArrowRight") {
              event.preventDefault();
              onCellSelect(address % 9 === 8 ? address : address + 1);
            }
          }}
          pattern="[0-9]*"
          readOnly={!editable}
          ref={inputRef}
          value={cellNumber ? String(cellNumber) : ""}
        />
        {cellNumber ? String(cellNumber) : ""}
      </label>
    </div>
  );
};

export const SudokuCell = memo(SudokuCellComponent);
