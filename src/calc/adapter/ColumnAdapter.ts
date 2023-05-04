import { Column } from "@/algorithm/dancinglinks/Column";
import { GridKey } from "@/model/GridKey";
import { IdMap } from "@/utility/IdMap";

export class ColumnAdapter extends Column {
  private col: GridKey;

  public constructor(col: GridKey) {
    super();
    this.col = col;
  }

  public get gridKey() {
    return this.col;
  }

  public static converter(cols: ColumnAdapter[]) {
    const mapper = new IdMap<GridKey, ColumnAdapter>();
    for (const c of cols) {
      mapper.set(c.gridKey, c);
    }

    return mapper;
  }
}