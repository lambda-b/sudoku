const SIZE = 9;

export type SudokuValidation =
  | { valid: true }
  | { valid: false; conflicts: number[] };

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

export const SUDOKU_UNITS = Array.from({ length: SIZE }, (_, index) => [
  row(index),
  column(index),
  box(index),
]).flat();

export const findSudokuConflicts = (table: string) => {
  if (!/^[0-9]{81}$/.test(table)) {
    return [];
  }

  const conflicts = new Set<number>();

  for (const unit of SUDOKU_UNITS) {
    const positions = new Map<string, number[]>();

    for (const address of unit) {
      const value = table[address];
      if (value === "0") {
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

export const validateSudokuTable = (table: string): SudokuValidation => {
  if (!/^[0-9]{81}$/.test(table)) {
    return { valid: false, conflicts: [] };
  }

  const conflicts = findSudokuConflicts(table);

  return conflicts.length ? { valid: false, conflicts } : { valid: true };
};
