import { Column } from "@sudoku/core/algorithm/dancinglinks/Column";
import type { GridKey } from "@sudoku/core/model/GridKey";
import { IdMap } from "@sudoku/utility/IdMap";

export class ColumnAdapter extends Column {
  #col: GridKey;

  constructor(col: GridKey) {
    super();
    this.#col = col;
  }

  get gridKey() {
    return this.#col;
  }

  static converter(cols: ColumnAdapter[]) {
    const mapper = new IdMap<GridKey, ColumnAdapter>();
    for (const c of cols) {
      mapper.set(c.gridKey, c);
    }

    return mapper;
  }
}
