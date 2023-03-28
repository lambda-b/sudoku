import { GridKey } from "@/model/GridKey";
import { ColType } from "@/model/type/ColType";
import { RowType } from "@/model/type/RowType";

export class GridRowColKey extends GridKey {
  private _row: RowType;
  private _col: ColType;

  constructor(row: RowType, col: ColType) {
    super("row_col");
    this._row = row;
    this._col = col;
  }

  get row() {
    return this._row;
  }

  get col() {
    return this._col;
  }

  get id() {
    return `ID:${this.type}:${this.row}:${this.col}`;
  }
}
