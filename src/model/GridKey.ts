import { PointType } from "@/model/type/PointType";
import { IdObject, IdType } from "@/utility/model/IdObject";

export abstract class GridKey implements IdObject {
  private _type: PointType;

  constructor(type: PointType) {
    this._type = type;
  }

  abstract get id(): IdType;

  get type() {
    return this._type;
  }

  public equals(obj: Object) {
    if (this === obj) {
      return true;
    }
    if (obj == null) {
      return false;
    }
    if (!(obj instanceof GridKey)) {
      return false;
    }

    const other = obj as GridKey;
    return this.id === other.id;
  }
}
