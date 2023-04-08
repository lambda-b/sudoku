import RowAdapter from "@/algorithm/adapter/RowAdapter";
import DancingLinks from "@/algorithm/DancingLinks";
import { GridKey } from "@/model/GridKey";
import { GridOption } from "@/model/GridOption";
import { IdObject } from "@/utility/model/IdObject";

export default class ColumnAdapter implements DancingLinks.Axis<RowAdapter, ColumnAdapter>, IdObject {
  private col: GridKey;

  private feasibles: Map<GridKey, GridOption[]>

  constructor(col: GridKey, feasibles: Map<GridKey, GridOption[]>) {
    this.col = col;
    this.feasibles = feasibles;
  }

  get gridKey() {
    return this.col;
  }

  get id() {
    return this.gridKey.id;
  }

  get size() {
    return this.feasibles.get(this.gridKey)?.length ?? 0;
  }

  public clear() {
    this.feasibles.delete(this.gridKey);
  }

  public restore(param: DancingLinks.Node<RowAdapter, ColumnAdapter>[]) {
    const options: GridOption[] = [];
    for (const [row, _] of param) {
      options.push(row.gridOption);
    }
    this.feasibles.set(this.gridKey, options);
  }

  public *getForwardNodes(): IterableIterator<DancingLinks.Node<RowAdapter, ColumnAdapter>> {
    const options = this.feasibles.get(this.gridKey) ?? [];
    for (const option of options) {
      yield [new RowAdapter(option, this.feasibles), this];
    }
  }

  public *getReverseNodes(): IterableIterator<DancingLinks.Node<RowAdapter, ColumnAdapter>> {
    const reverseList = Array.from(this.getForwardNodes()).reverse();
    for (const it of reverseList) {
      yield it;
    }
  }
}