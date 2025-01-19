import { ColType } from "@/model/type/ColType";
import { RowType } from "@/model/type/RowType";
import { SolutionNumberType } from "@/model/type/SolutionNumberType";
import BaseModel from "@/utility/model/BaseModel";
import { IdObject, equals } from "@/utility/model/IdObject";

export class GridOption implements BaseModel, IdObject {
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

  get id() {
    return `ID:${this.row}:${this.col}:${this.num}`;
  }

  public equals(obj: object) {
    return equals(this, obj);
  }
}
