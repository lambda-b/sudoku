import type { PointType } from "@sudoku/core/model/type/PointType";
import type BaseModel from "@sudoku/utility/model/BaseModel";
import {
  equals,
  type IdObject,
  type IdType,
} from "@sudoku/utility/model/IdObject";

export abstract class GridKey implements IdObject, BaseModel {
  #type: PointType;

  constructor(type: PointType) {
    this.#type = type;
  }

  abstract get id(): IdType;

  get type() {
    return this.#type;
  }

  equals(obj: object) {
    return equals(this, obj);
  }
}
