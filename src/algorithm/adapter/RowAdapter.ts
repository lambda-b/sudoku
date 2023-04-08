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

  private feasibles: Map<GridKey, GridOption[]>;

  constructor(row: GridOption, feasibles: Map<GridKey, GridOption[]>) {
    this.row = row;
    this.feasibles = feasibles;
  }

  get gridOption() {
    return this.row;
  }

  get size() {
    return 4;
  }

  public clear() {
    for (const [_, col] of this.getForwardNodes()) {
      const options = (this.feasibles.get(col.gridKey) ?? []).filter(
        (option) => !option.equals(this.gridOption)
      );
      this.feasibles.set(col.gridKey, options);
    }
  }

  public restore(param: DancingLinks.Node<RowAdapter, ColumnAdapter>[]) {
    for (const [_, col] of param) {
      const options = this.feasibles.get(col.gridKey) ?? [];
      options.push(this.gridOption);
      this.feasibles.set(col.gridKey, options);
    }
  }

  public *getForwardNodes(): IterableIterator<DancingLinks.Node<RowAdapter, ColumnAdapter>> {
    const { row, col, num } = this.gridOption;
    yield [this, new ColumnAdapter(new GridRowColKey(row, col), this.feasibles)];
    yield [this, new ColumnAdapter(new GridRowNumKey(row, num), this.feasibles)];
    yield [this, new ColumnAdapter(new GridColNumKey(col, num), this.feasibles)];
    const b = 3;
    const box = Math.floor(row / b) * b + Math.floor(col / b);
    yield [this, new ColumnAdapter(new GridBoxNumKey(box as BoxType, num), this.feasibles)];
  }

  public *getReverseNodes(): IterableIterator<DancingLinks.Node<RowAdapter, ColumnAdapter>> {
    const reverseList = Array.from(this.getForwardNodes()).reverse();
    for (const it of reverseList) {
      yield it;
    }
  }
}
