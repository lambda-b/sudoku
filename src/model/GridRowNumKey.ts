import { GridKey } from "@/model/GridKey";
import { RowType } from "@/model/type/RowType";
import { SolutionNumberType } from "@/model/type/SolutionNumberType";

export class GridRowNumKey extends GridKey {
  private _row: RowType;
  private _num: SolutionNumberType;

  constructor(row: RowType, num: SolutionNumberType) {
    super("row_num");
    this._row = row;
    this._num = num;
  }

  get row() {
    return this._row;
  }

  get num() {
    return this._num;
  }

  get id() {
    return `ID:${this.type}:${this.row}:${this.num}`;
  }
}
