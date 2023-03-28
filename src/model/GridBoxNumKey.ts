import { GridKey } from "@/model/GridKey";
import { BoxType } from "@/model/type/BoxType";
import { SolutionNumberType } from "@/model/type/SolutionNumberType";

export class GridBoxNumKey extends GridKey {
  private _box: BoxType;
  private _num: SolutionNumberType;

  constructor(box: BoxType, num: SolutionNumberType) {
    super("box_num");
    this._box = box;
    this._num = num;
  }

  get box() {
    return this._box;
  }

  get num() {
    return this._num;
  }

  get id() {
    return `ID:${this.type}:${this.box}:${this.num}`;
  }
}
