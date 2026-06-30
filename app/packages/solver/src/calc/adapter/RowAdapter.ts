import { Row } from "@sudoku/solver/algorithm/dancinglinks/Row";
import type { GridOption } from "@sudoku/solver/model/GridOption";
import { IdMap } from "@sudoku/utility/IdMap";

export class RowAdapter extends Row {
  #row: GridOption;

  constructor(row: GridOption) {
    super();
    this.#row = row;
  }

  get gridOption() {
    return this.#row;
  }

  static converter(rows: RowAdapter[]) {
    const mapper = new IdMap<GridOption, RowAdapter>();
    for (const r of rows) {
      mapper.set(r.gridOption, r);
    }

    return mapper;
  }
}
