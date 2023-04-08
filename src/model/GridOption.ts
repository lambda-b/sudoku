import { ColType } from "@/model/type/ColType";
import { RowType } from "@/model/type/RowType";
import { SolutionNumberType } from "@/model/type/SolutionNumberType";
import BaseModel from "@/utility/model/BaseModel";

export class GridOption implements BaseModel {
  private _row: RowType;
  private _col: ColType;
  private _num: SolutionNumberType;

  constructor(row: RowType, col: ColType, num: SolutionNumberType) {
    this._row = row;
    this._col = col;
    this._num = num;
  }

  get row() {
    return this._row;
  }

  get col() {
    return this._col;
  }

  get num() {
    return this._num;
  }

  public equals(obj: Object) {
    if (this === obj) {
      return true;
    }
    if (obj == null) {
      return false;
    }
    if (!(obj instanceof GridOption)) {
      return false;
    }

    const other = obj as GridOption;
    if (this.row !== other.row) {
      return false;
    }
    if (this.col !== other.col) {
      return false;
    }
    if (this.num !== other.num) {
      return false;
    }
    return true;
  }
}
