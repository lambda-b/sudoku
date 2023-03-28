import { GridKey } from "@/model/GridKey";
import { ColType } from "@/model/type/ColType";
import { SolutionNumberType } from "@/model/type/SolutionNumberType";

export class GridColNumKey extends GridKey {
  private _col: ColType;
  private _num: SolutionNumberType;

  constructor(col: ColType, num: SolutionNumberType) {
    super("col_num");
    this._col = col;
    this._num = num;
  }

  get col() {
    return this._col;
  }

  get num() {
    return this._num;
  }

  get id() {
    return `ID:${this.type}:${this.col}:${this.num}`;
  }
}
