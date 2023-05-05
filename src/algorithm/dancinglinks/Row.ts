import { LinkNode } from "@/algorithm/dancinglinks/LinkNode";

/**
 * 行クラス
 */
export class Row {

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
    const rtn = [origin];
    for (let node = origin.right; node !== origin; node = node.right) {
      rtn.push(node);
    }
    for (const node of rtn) {
      yield node;
    }
  }

  public clear() {
    for (const node of this) {
      node.clearVertical();
    }
  }

  public restore() {
    for (const node of this) {
      node.restoreVertical();
    }
  }
}