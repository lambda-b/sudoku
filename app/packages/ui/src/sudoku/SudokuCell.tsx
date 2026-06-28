import { Cell } from "@sudoku/ui/primitives/Cell";
import type { SudokuUiCell } from "@sudoku/ui/sudoku/types";
import { clsx } from "clsx";
import { memo } from "react";

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
  const { address, cellNumber, initialCellNumber, status } = cell;
  const isGiven = initialCellNumber !== 0;
  const editable = !isGiven && !disabled;

  const updateCellNumber = (cellNumber: number) =>
    editable && onCellNumberChange(address, cellNumber);
  const value = cellNumber ? String(cellNumber) : "";

  return (
    <div
      className={clsx(
        "h-[var(--sudoku-cell)] w-[var(--sudoku-cell)] border-[#b5b5b5]",
        className,
      )}
    >
      <Cell
        ariaLabel={`Sudoku cell ${address + 1}`}
        className={clsx(
          "[font-size:calc(var(--sudoku-cell)*0.5714)] [line-height:var(--sudoku-cell)]",
          isGiven && "font-bold text-zinc-900",
          status === "conflict" && "bg-red-100 text-red-700",
        )}
        disabled={!editable && !isGiven}
        focused={isSelected}
        onFocus={() => onCellSelect(address)}
        onDoubleClick={() => updateCellNumber(0)}
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
        onValueChange={(nextValue) => {
          const digit = nextValue.replace(/\D/g, "");
          updateCellNumber(digit ? Number(digit) : 0);
        }}
        readOnly={!editable}
        value={value}
      />
    </div>
  );
};

export const SudokuCell = memo(SudokuCellComponent);
