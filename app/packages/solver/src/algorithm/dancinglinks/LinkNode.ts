import type { Column } from "@sudoku/solver/algorithm/dancinglinks/Column";
import type { Row } from "@sudoku/solver/algorithm/dancinglinks/Row";

export class LinkNode {
  #row: Row;
  #col: Column;
  #up: LinkNode;
  #down: LinkNode;
  #left: LinkNode;
  #right: LinkNode;

  private constructor(row: Row, col: Column) {
    this.#row = row;
    this.#col = col;
    this.#up = this;
    this.#down = this;
    this.#left = this;
    this.#right = this;
  }

  /**
   * ファクトリーメソッド<br>
   * 新しいノードを作成し、周辺の接続情報も解決する.
   * @returns ノード
   */
  static create(row: Row, col: Column) {
    const node = new LinkNode(row, col);

    // 周辺 Node の 接続情報を更新する.
    node.restoreVertical();
    node.#restoreHorizontal();

    return node;
  }

  /**
   * 上下の接続情報を変更し、自身を縦の関係からノードとして無効化する
   */
  clearVertical() {
    if (this.col.origin === this) {
      this.col.setOrigin(this === this.down ? null : this.down);
    }
    this.up.#down = this.#down;
    this.down.#up = this.#up;

    this.#up = this;
    this.#down = this;
  }

  /**
   * 上下の接続情報を新しく作成
   */
  restoreVertical() {
    if (this.col.origin) {
      this.#up = this.col.origin.up;
      this.#down = this.col.origin;
      this.col.origin.up.#down = this;
      this.col.origin.#up = this;
    } else {
      this.col.setOrigin(this);
    }
  }

  /**
   * 左右の接続情報を新しく作成
   */
  #restoreHorizontal() {
    if (this.row.origin) {
      this.#left = this.row.origin.left;
      this.#right = this.row.origin;
      this.row.origin.left.#right = this;
      this.row.origin.#left = this;
    } else {
      this.row.setOrigin(this);
    }
  }

  get row() {
    return this.#row;
  }

  get col() {
    return this.#col;
  }

  get up() {
    return this.#up;
  }

  get down() {
    return this.#down;
  }

  get left() {
    return this.#left;
  }

  get right() {
    return this.#right;
  }
}
