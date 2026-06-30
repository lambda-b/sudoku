import type { Column } from "@sudoku/solver/algorithm/dancinglinks/Column";
import type { LinkNode } from "@sudoku/solver/algorithm/dancinglinks/LinkNode";

export class Restores {
  #col: Column;

  #restores: LinkNode[] = [];

  constructor(col: Column) {
    this.#col = col;
  }

  get col() {
    return this.#col;
  }

  push(node: LinkNode) {
    this.#restores.push(node);
  }

  *[Symbol.iterator]() {
    for (const node of this.#restores) {
      yield node;
    }
  }
}
