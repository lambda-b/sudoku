import { Row } from "@/algorithm/dancinglinks/Row";
import { GridOption } from "@/model/GridOption";
import { IdMap } from "@/utility/IdMap";

export class RowAdapter extends Row {
  private row: GridOption;

  public constructor(row: GridOption) {
    super();
    this.row = row;
  }

  get gridOption() {
    return this.row;
  }

  public static converter(rows: RowAdapter[]) {
    const mapper = new IdMap<GridOption, RowAdapter>();
    for (const r of rows) {
      mapper.set(r.gridOption, r);
    }

    return mapper;
  }
}
