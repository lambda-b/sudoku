import type { ColType } from "@/model/type/ColType";
import type { RowType } from "@/model/type/RowType";
import type { SolutionNumberType } from "@/model/type/SolutionNumberType";
import type BaseModel from "@/utility/model/BaseModel";
import { equals, type IdObject } from "@/utility/model/IdObject";

export class GridOption implements BaseModel, IdObject {
  #row: RowType;
  #col: ColType;
  #num: SolutionNumberType;

  constructor(row: RowType, col: ColType, num: SolutionNumberType) {
    this.#row = row;
    this.#col = col;
    this.#num = num;
  }

  get row() {
    return this.#row;
  }

  get col() {
    return this.#col;
  }

  get num() {
    return this.#num;
  }

  get id() {
    return `ID:${this.row}:${this.col}:${this.num}`;
  }

  equals(obj: object) {
    return equals(this, obj);
  }
}
