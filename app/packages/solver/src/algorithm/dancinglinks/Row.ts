import type { LinkNode } from "@sudoku/solver/algorithm/dancinglinks/LinkNode";

/**
 * 行クラス
 */
export class Row {
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
    const rtn = [origin];
    for (let node = origin.right; node !== origin; node = node.right) {
      rtn.push(node);
    }
    for (const node of rtn) {
      yield node;
    }
  }

  clear() {
    for (const node of this) {
      node.clearVertical();
    }
  }

  restore() {
    for (const node of this) {
      node.restoreVertical();
    }
  }
}
