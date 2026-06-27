import type { AddressNumberType } from "@sudoku/core/model/type/AddressNumber";

export type SudokuCellStatus = "default" | "conflict";

export type SudokuUiCell = {
  address: AddressNumberType;
  cellNumber: number;
  initialCellNumber: number;
  status: SudokuCellStatus;
};
