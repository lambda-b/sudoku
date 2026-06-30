import { ADDRESS_NUMBER } from "@sudoku/core/model/type/AddressNumber";
import type { SudokuUiCell } from "@sudoku/ui/sudoku/types";

const SIZE = 9;

type SudokuCellsAction =
  | {
      type: "cellNumberChanged";
      address: number;
      cellNumber: number;
    }
  | {
      type: "tableApplied";
      table: string;
    }
  | {
      type: "puzzleApplied";
      puzzle: string;
    }
  | {
      type: "conflictsChanged";
      conflicts: number[];
    }
  | {
      type: "reset";
    };

const row = (index: number) =>
  Array.from({ length: SIZE }, (_, offset) => index * SIZE + offset);

const column = (index: number) =>
  Array.from({ length: SIZE }, (_, offset) => offset * SIZE + index);

const box = (index: number) => {
  const firstRow = Math.floor(index / 3) * 3;
  const firstColumn = (index % 3) * 3;

  return Array.from(
    { length: SIZE },
    (_, offset) =>
      (firstRow + Math.floor(offset / 3)) * SIZE + firstColumn + (offset % 3),
  );
};

const units = Array.from({ length: SIZE }, (_, index) => [
  row(index),
  column(index),
  box(index),
]).flat();

export const createSudokuCells = (puzzle: string): SudokuUiCell[] =>
  ADDRESS_NUMBER.map((address) => {
    const cellNumber = Number(puzzle[address] ?? "0");

    return {
      cellNumber,
      initialCellNumber: cellNumber,
      address,
      status: "default",
    };
  });

export const sudokuCellsToTable = (cells: SudokuUiCell[]) =>
  cells.map((cell) => cell.cellNumber).join("");

const applyCellStatuses = (
  cells: SudokuUiCell[],
  conflicts: number[],
): SudokuUiCell[] => {
  const conflictSet = new Set(conflicts);

  return cells.map((cell) => {
    const status = conflictSet.has(cell.address) ? "conflict" : "default";
    return cell.status === status ? cell : { ...cell, status };
  });
};

const findConflicts = (cells: SudokuUiCell[]) => {
  const conflicts = new Set<number>();

  for (const unit of units) {
    const positions = new Map<number, number[]>();

    for (const address of unit) {
      const value = cells[address]?.cellNumber ?? 0;
      if (value === 0) {
        continue;
      }

      positions.set(value, [...(positions.get(value) ?? []), address]);
    }

    for (const addresses of positions.values()) {
      if (addresses.length > 1) {
        for (const address of addresses) {
          conflicts.add(address);
        }
      }
    }
  }

  return [...conflicts].sort((a, b) => a - b);
};

const validateCells = (cells: SudokuUiCell[]) =>
  applyCellStatuses(cells, findConflicts(cells));

export const reduceSudokuCells = (
  cells: SudokuUiCell[],
  action: SudokuCellsAction,
): SudokuUiCell[] => {
  switch (action.type) {
    case "cellNumberChanged": {
      const nextCells = cells.map((cell) => {
        if (cell.address === action.address) {
          if (cell.initialCellNumber !== 0) {
            return cell;
          }

          return cell.cellNumber === action.cellNumber &&
            cell.status === "default"
            ? cell
            : {
                ...cell,
                cellNumber: action.cellNumber,
                status: "default" as const,
              };
        }

        return cell.status === "default"
          ? cell
          : { ...cell, status: "default" as const };
      });

      return validateCells(nextCells);
    }

    case "tableApplied": {
      if (action.table.length !== ADDRESS_NUMBER.length) {
        return cells;
      }

      const nextCells = cells.map((cell, address) => {
        const cellNumber = Number(action.table[address]);
        return cell.cellNumber === cellNumber && cell.status === "default"
          ? cell
          : { ...cell, cellNumber, status: "default" as const };
      });

      return validateCells(nextCells);
    }

    case "puzzleApplied": {
      if (action.puzzle.length !== ADDRESS_NUMBER.length) {
        return cells;
      }

      return validateCells(createSudokuCells(action.puzzle));
    }

    case "conflictsChanged":
      return applyCellStatuses(cells, action.conflicts);

    case "reset": {
      const nextCells = cells.map((cell) => {
        const nextCell = {
          ...cell,
          cellNumber: cell.initialCellNumber,
          status: "default" as const,
        };

        return cell.cellNumber === nextCell.cellNumber &&
          cell.status === nextCell.status
          ? cell
          : nextCell;
      });

      return validateCells(nextCells);
    }
  }
};
