import { AddressNumberType } from "@/model/type/AddressNumber";

export interface SudokuCellModel {
  cellNumber: number,
  address: AddressNumberType,
  isSelected: boolean,
}
