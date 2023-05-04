import { LinkNode } from "@/algorithm/dancinglinks/LinkNode";

/**
 * 行クラス <br>
 * 行処理のHelper的役割を担う
 */
export class Row {

  private _origin: LinkNode | null = null;

  public get origin() {
    return this._origin;
  }

  public setOrigin(origin: LinkNode | null) {
    this._origin = origin;
  }

  public *getForwardNodes() {
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


  public *getReverseNodes() {
    if (this.origin === null) {
      return;
    }

    const origin = this.origin;
    const rtn = [origin];
    for (let node = this.origin.left; node !== this.origin; node = node.left) {
      rtn.push(node);
    }
    for (const node of rtn) {
      yield node;
    }
  }

  public clear() {
    for (const node of this.getForwardNodes()) {
      node.clearVertical();
    }
  }

  public restore() {
    for (const node of this.getForwardNodes()) {
      node.restoreVertical();
    }
  }
}