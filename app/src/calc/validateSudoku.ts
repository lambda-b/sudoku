export type SudokuValidation =
  | { valid: true }
  | { valid: false; conflicts: number[] };

const SIZE = 9;

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

export const validateSudoku = (data: string): SudokuValidation => {
  if (!/^[0-9]{81}$/.test(data)) {
    return { valid: false, conflicts: [] };
  }

  const conflicts = new Set<number>();

  for (const unit of units) {
    const positions = new Map<string, number[]>();

    for (const address of unit) {
      const value = data[address];
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

  return conflicts.size
    ? { valid: false, conflicts: [...conflicts].sort((a, b) => a - b) }
    : { valid: true };
};
