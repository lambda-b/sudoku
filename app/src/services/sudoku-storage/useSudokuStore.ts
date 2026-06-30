import { ADDRESS_NUMBER } from "@sudoku/core/model/type/AddressNumber";
import type { SudokuUiCell } from "@sudoku/ui/sudoku/types";
import type { Dispatch, SetStateAction } from "react";
import { useLocalStorage } from "usehooks-ts";

const STORAGE_KEY = "sudoku:cells:v2";

type PersistedSudokuCell = Pick<
  SudokuUiCell,
  "address" | "cellNumber" | "initialCellNumber" | "status"
>;

type SudokuStoreSnapshot = {
  cells: PersistedSudokuCell[];
  updatedAt: string;
  version: 2;
};

const isCellNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 9;

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

const createSnapshot = (cells: SudokuUiCell[]): SudokuStoreSnapshot => ({
  cells,
  updatedAt: new Date().toISOString(),
  version: 2,
});

const parseSnapshot = (
  value: string,
  fallbackCells: SudokuUiCell[],
): SudokuStoreSnapshot => {
  try {
    const snapshot = JSON.parse(value) as SudokuStoreSnapshot;

    if (
      snapshot.version !== 2 ||
      !Array.isArray(snapshot.cells) ||
      snapshot.cells.length !== ADDRESS_NUMBER.length ||
      !snapshot.cells.every((cell, address) => isPersistedCell(cell, address))
    ) {
      return createSnapshot(fallbackCells);
    }

    return snapshot;
  } catch {
    return createSnapshot(fallbackCells);
  }
};

export const useSudokuStore = (
  initialCells: SudokuUiCell[] | (() => SudokuUiCell[]),
): readonly [SudokuUiCell[], Dispatch<SetStateAction<SudokuUiCell[]>>] => {
  const resolveInitialCells = () =>
    typeof initialCells === "function" ? initialCells() : initialCells;

  const [snapshot, setSnapshot] = useLocalStorage<SudokuStoreSnapshot>(
    STORAGE_KEY,
    () => createSnapshot(resolveInitialCells()),
    {
      deserializer: (value) => parseSnapshot(value, resolveInitialCells()),
    },
  );

  const setCells: Dispatch<SetStateAction<SudokuUiCell[]>> =
    (nextCells) => {
      setSnapshot((currentSnapshot) => {
        const cells =
          typeof nextCells === "function"
            ? nextCells(currentSnapshot.cells)
            : nextCells;

        return createSnapshot(cells);
      });
    };

  return [snapshot.cells, setCells];
};
