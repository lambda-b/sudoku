import RowAdapter from "@/algorithm/adapter/RowAdapter";
import DancingLinks from "@/algorithm/DancingLinks";
import { GridKey } from "@/model/GridKey";
import { GridOption } from "@/model/GridOption";
import { IdObject } from "@/utility/model/IdObject";

export default class ColumnAdapter implements DancingLinks.Axis<RowAdapter, ColumnAdapter>, IdObject {
  private col: GridKey;

  private static feasibles: Map<GridKey, GridOption[]>

  constructor(col: GridKey) {
    this.col = col;
  }

  public static setFeasibles(feasibles: Map<GridKey, GridOption[]>) {
    ColumnAdapter.feasibles = feasibles;
  }

  get gridKey() {
    return this.col;
  }

  get id() {
    return this.gridKey.id;
  }

  get size() {
    return ColumnAdapter.feasibles.get(this.gridKey)?.length ?? 0;
  }

  public clear() {
    ColumnAdapter.feasibles.delete(this.gridKey);
  }

  public restore(param: DancingLinks.Node<RowAdapter, ColumnAdapter>[]) {
    const options: GridOption[] = [];
    for (const [row, _] of param) {
      options.push(row.gridOption);
    }
    ColumnAdapter.feasibles.set(this.gridKey, options);
  }

  public *getForwardNodes(): IterableIterator<DancingLinks.Node<RowAdapter, ColumnAdapter>> {
    const options = ColumnAdapter.feasibles.get(this.gridKey) ?? [];
    for (const option of options) {
      yield [new RowAdapter(option), this];
    }
  }

  public *getReverseNodes(): IterableIterator<DancingLinks.Node<RowAdapter, ColumnAdapter>> {
    const reverseList = Array.from(this.getForwardNodes()).reverse();
    for (const it of reverseList) {
      yield it;
    }
  }
}