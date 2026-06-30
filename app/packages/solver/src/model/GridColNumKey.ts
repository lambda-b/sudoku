import { GridKey } from "@sudoku/solver/model/GridKey";
import type { ColType } from "@sudoku/solver/model/type/ColType";
import type { SolutionNumberType } from "@sudoku/solver/model/type/SolutionNumberType";

export class GridColNumKey extends GridKey {
  #col: ColType;
  #num: SolutionNumberType;

  constructor(col: ColType, num: SolutionNumberType) {
    super("col_num");
    this.#col = col;
    this.#num = num;
  }

  get col() {
    return this.#col;
  }

  get num() {
    return this.#num;
  }

  get id() {
    return `ID:${this.type}:${this.col}:${this.num}`;
  }
}
