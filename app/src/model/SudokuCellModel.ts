import type { AddressNumberType } from "@sudoku/core/model/type/AddressNumber";

export interface SudokuCellModel {
  cellNumber: number;
  initialCellNumber: number;
  address: AddressNumberType;
  isSelected: boolean;
  isGiven: boolean;
  status: "default" | "conflict";
}
