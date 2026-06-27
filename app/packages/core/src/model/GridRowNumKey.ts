import { GridKey } from "@sudoku/core/model/GridKey";
import type { RowType } from "@sudoku/core/model/type/RowType";
import type { SolutionNumberType } from "@sudoku/core/model/type/SolutionNumberType";

export class GridRowNumKey extends GridKey {
  #row: RowType;
  #num: SolutionNumberType;

  constructor(row: RowType, num: SolutionNumberType) {
    super("row_num");
    this.#row = row;
    this.#num = num;
  }

  get row() {
    return this.#row;
  }

  get num() {
    return this.#num;
  }

  get id() {
    return `ID:${this.type}:${this.row}:${this.num}`;
  }
}
