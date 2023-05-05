import { PointType } from "@/model/type/PointType";
import BaseModel from "@/utility/model/BaseModel";
import { IdObject, IdType, equals } from "@/utility/model/IdObject";

export abstract class GridKey implements IdObject, BaseModel {
  private _type: PointType;

  constructor(type: PointType) {
    this._type = type;
  }

  abstract get id(): IdType;

  get type() {
    return this._type;
  }

  public equals(obj: Object) {
    return equals(this, obj);
  }
}
