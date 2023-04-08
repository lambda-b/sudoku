import ColumnAdapter from "@/algorithm/adapter/ColumnAdapter";
import DancingLinks from "@/algorithm/DancingLinks";
import { GridBoxNumKey } from "@/model/GridBoxNumKey";
import { GridColNumKey } from "@/model/GridColNumKey";
import { GridKey } from "@/model/GridKey";
import { GridOption } from "@/model/GridOption";
import { GridRowColKey } from "@/model/GridRowColKey";
import { GridRowNumKey } from "@/model/GridRowNumKey";
import { BoxType } from "@/model/type/BoxType";

export default class RowAdapter implements DancingLinks.Axis<RowAdapter, ColumnAdapter> {
  private row: GridOption;

  private static feasibles: Map<GridKey, GridOption[]>;

  constructor(row: GridOption) {
    this.row = row;
  }

  public static setFeasible(feasbiles: Map<GridKey, GridOption[]>) {
    RowAdapter.feasibles = feasbiles;
  }

  get gridOption() {
    return this.row;
  }

  get size() {
    return 4;
  }

  public clear() {
    for (const [_, col] of this.getForwardNodes()) {
      const options = (RowAdapter.feasibles.get(col.gridKey) ?? []).filter(
        (option) => !option.equals(this.gridOption)
      );
      RowAdapter.feasibles.set(col.gridKey, options);
    }
  }

  public restore(param: DancingLinks.Node<RowAdapter, ColumnAdapter>[]) {
    for (const [_, col] of param) {
      const options = RowAdapter.feasibles.get(col.gridKey) ?? [];
      options.push(this.gridOption);
      RowAdapter.feasibles.set(col.gridKey, options);
    }
  }

  public *getForwardNodes(): IterableIterator<DancingLinks.Node<RowAdapter, ColumnAdapter>> {
    const { row, col, num } = this.gridOption;
    yield [this, new ColumnAdapter(new GridRowColKey(row, col))];
    yield [this, new ColumnAdapter(new GridRowNumKey(row, num))];
    yield [this, new ColumnAdapter(new GridColNumKey(col, num))];
    const b = 3;
    const box = Math.floor(row / b) * b + Math.floor(col / b);
    yield [this, new ColumnAdapter(new GridBoxNumKey(box as BoxType, num))];
  }

  public *getReverseNodes(): IterableIterator<DancingLinks.Node<RowAdapter, ColumnAdapter>> {
    const reverseList = Array.from(this.getForwardNodes()).reverse();
    for (const it of reverseList) {
      yield it;
    }
  }
}
