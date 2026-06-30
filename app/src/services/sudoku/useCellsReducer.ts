import { ADDRESS_NUMBER } from "@sudoku/core/model/type/AddressNumber";
import { isSolutionNumberType } from "@sudoku/core/model/type/SolutionNumberType";
import { findSudokuConflicts } from "@sudoku/core/rules";
import type { SudokuUiCell } from "@sudoku/ui/sudoku/types";
import { type Dispatch, useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";

const STORAGE_KEY = "sudoku:cells:v1";

type PersistedSudokuCell = Pick<
  SudokuUiCell,
  "address" | "cellNumber" | "initialCellNumber" | "status"
>;

type PersistedSudokuCells = {
  cells: PersistedSudokuCell[];
  updatedAt: string;
  version: 2;
};

export type CellsAction =
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

const isCellNumber = (value: unknown): value is number =>
  value === 0 || (typeof value === "number" && isSolutionNumberType(value));

const isPersistedCell = (
  cell: unknown,
  address: number,
): cell is PersistedSudokuCell => {
  if (!cell || typeof cell !== "object") {
    return false;
  }

  const persistedCell = cell as PersistedSudokuCell;
  return (
    persistedCell.address === address &&
    isCellNumber(persistedCell.cellNumber) &&
    isCellNumber(persistedCell.initialCellNumber) &&
    (persistedCell.status === "default" || persistedCell.status === "conflict")
  );
};

const createPersistedCells = (cells: SudokuUiCell[]): PersistedSudokuCells => ({
  cells,
  updatedAt: new Date().toISOString(),
  version: 2,
});

export const createCells = (puzzle: string): SudokuUiCell[] =>
  ADDRESS_NUMBER.map((address) => {
    const cellNumber = Number(puzzle[address] ?? "0");

    return {
      cellNumber,
      initialCellNumber: cellNumber,
      address,
      status: "default",
    };
  });

export const cellsToTable = (cells: SudokuUiCell[]) =>
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

const validateCells = (cells: SudokuUiCell[]) =>
  applyCellStatuses(cells, findSudokuConflicts(cellsToTable(cells)));

const parsePersistedCells = (
  value: string,
  fallbackCells: SudokuUiCell[],
): PersistedSudokuCells => {
  try {
    const persistedCells = JSON.parse(value) as PersistedSudokuCells;

    if (
      persistedCells.version !== 2 ||
      !Array.isArray(persistedCells.cells) ||
      persistedCells.cells.length !== ADDRESS_NUMBER.length ||
      !persistedCells.cells.every((cell, address) =>
        isPersistedCell(cell, address),
      )
    ) {
      return createPersistedCells(fallbackCells);
    }

    return persistedCells;
  } catch {
    return createPersistedCells(fallbackCells);
  }
};

const reduceSudokuCells = (
  cells: SudokuUiCell[],
  action: CellsAction,
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

      return validateCells(createCells(action.puzzle));
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

export const useCellsReducer = (
  initialCells: SudokuUiCell[] | (() => SudokuUiCell[]),
): readonly [SudokuUiCell[], Dispatch<CellsAction>] => {
  const resolveInitialCells = () =>
    typeof initialCells === "function" ? initialCells() : initialCells;

  const [persistedCells, setPersistedCells] =
    useLocalStorage<PersistedSudokuCells>(
      STORAGE_KEY,
      () => createPersistedCells(resolveInitialCells()),
      {
        deserializer: (value) =>
          parsePersistedCells(value, resolveInitialCells()),
      },
    );

  const dispatch = useCallback<Dispatch<CellsAction>>(
    (action) => {
      setPersistedCells((currentPersistedCells) => {
        return createPersistedCells(
          reduceSudokuCells(currentPersistedCells.cells, action),
        );
      });
    },
    [setPersistedCells],
  );

  return [persistedCells.cells, dispatch];
};
