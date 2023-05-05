import { LinkNode } from "@/algorithm/dancinglinks/LinkNode";

/**
 * 列クラス<br>
 * 列処理のHelper的役割を担う
 */
export class Column {

  private _origin: LinkNode | null = null;

  public get origin() {
    return this._origin;
  }

  public setOrigin(origin: LinkNode | null) {
    this._origin = origin;
  }

  public *[Symbol.iterator]() {
    if (this.origin === null) {
      return;
    }

    const origin = this.origin;
    const rtn: LinkNode[] = [origin];
    for (let node = origin.down; node !== origin; node = node.down) {
      rtn.push(node);
    }
    for (const node of rtn) {
      yield node;
    }
  }

  public get size() {
    const size = Array.from(this).length;
    return size;
  }

  public static minimum(columns: Set<Column>) {
    let minCol = null;
    let minSize = Infinity;

    for (const col of columns) {
      minCol = col.size < minSize ? col : minCol;
      minSize = Math.min(col.size, minSize);
    }

    return minCol;
  }
}