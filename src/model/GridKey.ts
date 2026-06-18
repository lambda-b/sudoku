import type { PointType } from "@/model/type/PointType";
import type BaseModel from "@/utility/model/BaseModel";
import { equals, type IdObject, type IdType } from "@/utility/model/IdObject";

export abstract class GridKey implements IdObject, BaseModel {
  private _type: PointType;

  constructor(type: PointType) {
    this._type = type;
  }

  abstract get id(): IdType;

  get type() {
    return this._type;
  }

  public equals(obj: object) {
    return equals(this, obj);
  }
}
