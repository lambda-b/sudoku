import { SudokuCell } from "@sudoku/ui/sudoku/SudokuCell";
import type { SudokuUiCell } from "@sudoku/ui/sudoku/types";

const rows = Array.from({ length: 9 }, (_, rowIdx) =>
  Array.from({ length: 9 }, (_, colIdx) => 9 * rowIdx + colIdx),
);

const cellBorders = [
  "border-t-[3px] border-b border-l-[3px] border-r",
  "border-t-[3px] border-b border-x",
  "border-t-[3px] border-b border-l border-r-[3px]",
  "border-t border-b border-l-[3px] border-r",
  "border",
  "border-t border-b border-l border-r-[3px]",
  "border-t border-b-[3px] border-l-[3px] border-r",
  "border-t border-b-[3px] border-x",
  "border-t border-b-[3px] border-l border-r-[3px]",
];

type SudokuBoardProps = {
  cells: SudokuUiCell[];
  disabled?: boolean;
  onCellNumberChange: (address: number, cellNumber: number) => void;
  onCellSelect: (address: number) => void;
  selectedAddress: number | -1;
};

export const SudokuBoard = ({
  cells,
  disabled = false,
  onCellNumberChange,
  onCellSelect,
  selectedAddress,
}: SudokuBoardProps) => {
  return (
    <div className="mx-auto h-[var(--sudoku-board)] w-[var(--sudoku-board)] px-0">
      {rows.map((row) => {
        const rowIdx = Math.floor(row[0] / 9);

        return (
          <div
            key={`row-${row[0]}`}
            className="flex items-center justify-center"
          >
            {row.map((address) => {
              const colIdx = address % 9;
              const type = 3 * (rowIdx % 3) + (colIdx % 3) + 1;

              return (
                <SudokuCell
                  key={address}
                  cell={cells[address]}
                  className={cellBorders[type - 1]}
                  disabled={disabled}
                  isSelected={address === selectedAddress}
                  onCellNumberChange={onCellNumberChange}
                  onCellSelect={onCellSelect}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
