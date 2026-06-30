import { ADDRESS_NUMBER } from "@sudoku/core/model/type/AddressNumber";
import { isSolutionNumberType } from "@sudoku/core/model/type/SolutionNumberType";
import type { SudokuUiCell } from "@sudoku/ui/sudoku/types";
import { type Dispatch, type SetStateAction, useRef } from "react";
import { useLocalStorage } from "usehooks-ts";

const STORAGE_KEY = "sudoku:cells:v2";
const LEGACY_STORAGE_KEYS = ["sudoku:cells:v1"] as const;

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

const readStoredSnapshot = (
  key: string,
  fallbackCells: SudokuUiCell[],
): SudokuStoreSnapshot | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? parseSnapshot(value, fallbackCells) : null;
  } catch {
    return null;
  }
};

const createInitialSnapshot = (
  initialCells: SudokuUiCell[] | (() => SudokuUiCell[]),
) => {
  const fallbackCells =
    typeof initialCells === "function" ? initialCells() : initialCells;

  for (const key of LEGACY_STORAGE_KEYS) {
    const snapshot = readStoredSnapshot(key, fallbackCells);
    if (snapshot) {
      return snapshot;
    }
  }

  return createSnapshot(fallbackCells);
};

export const useSudokuStore = (
  initialCells: SudokuUiCell[] | (() => SudokuUiCell[]),
): readonly [SudokuUiCell[], Dispatch<SetStateAction<SudokuUiCell[]>>] => {
  const initialSnapshotRef = useRef<SudokuStoreSnapshot | null>(null);
  if (!initialSnapshotRef.current) {
    initialSnapshotRef.current = createInitialSnapshot(initialCells);
  }

  const getInitialSnapshot = () =>
    initialSnapshotRef.current ?? createInitialSnapshot(initialCells);

  const [snapshot, setSnapshot] = useLocalStorage<SudokuStoreSnapshot>(
    STORAGE_KEY,
    getInitialSnapshot,
    {
      deserializer: (value) => parseSnapshot(value, getInitialSnapshot().cells),
    },
  );

  const setCells: Dispatch<SetStateAction<SudokuUiCell[]>> = (nextCells) => {
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
