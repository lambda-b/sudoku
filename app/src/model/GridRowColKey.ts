import { GridKey } from "@/model/GridKey";
import type { ColType } from "@/model/type/ColType";
import type { RowType } from "@/model/type/RowType";

export class GridRowColKey extends GridKey {
  #row: RowType;
  #col: ColType;

  constructor(row: RowType, col: ColType) {
    super("row_col");
    this.#row = row;
    this.#col = col;
  }

  get row() {
    return this.#row;
  }

  get col() {
    return this.#col;
  }

  get id() {
    return `ID:${this.type}:${this.row}:${this.col}`;
  }
}
