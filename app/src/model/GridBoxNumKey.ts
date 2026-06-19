import { GridKey } from "@/model/GridKey";
import type { BoxType } from "@/model/type/BoxType";
import type { SolutionNumberType } from "@/model/type/SolutionNumberType";

export class GridBoxNumKey extends GridKey {
  #box: BoxType;
  #num: SolutionNumberType;

  constructor(box: BoxType, num: SolutionNumberType) {
    super("box_num");
    this.#box = box;
    this.#num = num;
  }

  get box() {
    return this.#box;
  }

  get num() {
    return this.#num;
  }

  get id() {
    return `ID:${this.type}:${this.box}:${this.num}`;
  }
}
