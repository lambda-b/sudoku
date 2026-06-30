import type { LinkNode } from "@sudoku/solver/algorithm/dancinglinks/LinkNode";

/**
 * 列クラス
 */
export class Column {
  #origin: LinkNode | null = null;

  get origin() {
    return this.#origin;
  }

  setOrigin(origin: LinkNode | null) {
    this.#origin = origin;
  }

  *[Symbol.iterator]() {
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

  get size() {
    const size = Array.from(this).length;
    return size;
  }

  static minimum(columns: Set<Column>) {
    let minCol = null;
    let minSize = Infinity;

    for (const col of columns) {
      minCol = col.size < minSize ? col : minCol;
      minSize = Math.min(col.size, minSize);
    }

    return minCol;
  }
}
