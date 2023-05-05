import { Column } from "@/algorithm/dancinglinks/Column";
import { LinkNode } from "@/algorithm/dancinglinks/LinkNode";

export class Restores {
  private _col: Column;

  private _restores: LinkNode[] = [];

  public constructor(col: Column) {
    this._col = col;
  }

  public get col() {
    return this._col;
  }

  public push(node: LinkNode) {
    this._restores.push(node);
  }

  public *[Symbol.iterator]() {
    for (const node of this._restores) {
      yield node;
    }
  }
}