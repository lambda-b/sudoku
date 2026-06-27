import type { AddressNumberType } from "@/model/type/AddressNumber";

export interface SudokuCellModel {
  cellNumber: number;
  address: AddressNumberType;
  isSelected: boolean;
  status: "default" | "conflict";
}
