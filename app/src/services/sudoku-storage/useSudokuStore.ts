import { ADDRESS_NUMBER } from "@sudoku/core/model/type/AddressNumber";
import type { SudokuUiCell } from "@sudoku/ui/sudoku/types";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useRef,
  useSyncExternalStore,
} from "react";

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

const listeners = new Set<() => void>();
let cachedRawSnapshot: string | null = null;
let cachedCells: SudokuUiCell[] | null = null;

const notify = () => {
  for (const listener of listeners) {
    listener();
  }
};

const canUseLocalStorage = () => typeof window !== "undefined";

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

const parseCells = (value: string | null): SudokuUiCell[] | null => {
  if (!value) {
    return null;
  }

  try {
    const snapshot = JSON.parse(value) as SudokuStoreSnapshot;

    if (
      snapshot.version !== 2 ||
      !Array.isArray(snapshot.cells) ||
      snapshot.cells.length !== ADDRESS_NUMBER.length ||
      !snapshot.cells.every((cell, address) => isPersistedCell(cell, address))
    ) {
      return null;
    }

    return snapshot.cells;
  } catch {
    return null;
  }
};

const readStoredCells = (): SudokuUiCell[] | null => {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    const rawSnapshot = window.localStorage.getItem(STORAGE_KEY);
    if (rawSnapshot === cachedRawSnapshot) {
      return cachedCells;
    }

    cachedRawSnapshot = rawSnapshot;
    cachedCells = parseCells(rawSnapshot);
    return cachedCells;
  } catch {
    return null;
  }
};

const saveCells = (cells: SudokuUiCell[]) => {
  if (!canUseLocalStorage()) {
    cachedCells = cells;
    notify();
    return;
  }

  const snapshot: SudokuStoreSnapshot = {
    cells,
    updatedAt: new Date().toISOString(),
    version: 2,
  };
  const serializedSnapshot = JSON.stringify(snapshot);

  try {
    window.localStorage.setItem(STORAGE_KEY, serializedSnapshot);
    cachedRawSnapshot = serializedSnapshot;
  } catch {
    // Saving progress is best-effort; gameplay should continue without storage.
  }

  cachedCells = cells;
  notify();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cachedRawSnapshot = event.newValue;
      cachedCells = parseCells(event.newValue);
      listener();
    }
  };

  if (canUseLocalStorage()) {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    listeners.delete(listener);
    if (canUseLocalStorage()) {
      window.removeEventListener("storage", handleStorage);
    }
  };
};

export const useSudokuStore = (
  initialCells: SudokuUiCell[] | (() => SudokuUiCell[]),
): readonly [SudokuUiCell[], Dispatch<SetStateAction<SudokuUiCell[]>>] => {
  const initialCellsRef = useRef<SudokuUiCell[] | null>(null);
  if (!initialCellsRef.current) {
    initialCellsRef.current =
      typeof initialCells === "function" ? initialCells() : initialCells;
  }

  const getSnapshot = useCallback(
    () => readStoredCells() ?? initialCellsRef.current ?? [],
    [],
  );

  const cells = useSyncExternalStore(subscribe, getSnapshot, () =>
    initialCellsRef.current ?? [],
  );

  const setCells = useCallback<Dispatch<SetStateAction<SudokuUiCell[]>>>(
    (nextCells) => {
      const currentCells = getSnapshot();
      saveCells(
        typeof nextCells === "function" ? nextCells(currentCells) : nextCells,
      );
    },
    [getSnapshot],
  );

  return [cells, setCells];
};
