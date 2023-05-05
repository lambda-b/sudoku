import { Column } from "@/algorithm/dancinglinks/Column";
import { Row } from "@/algorithm/dancinglinks/Row";

export class LinkNode {
  private _row: Row;
  private _col: Column;
  private _up: LinkNode;
  private _down: LinkNode;
  private _left: LinkNode;
  private _right: LinkNode;

  private constructor(row: Row, col: Column) {
    this._row = row;
    this._col = col;
    this._up = this;
    this._down = this;
    this._left = this;
    this._right = this;
  }

  /**
   * ファクトリーメソッド<br>
   * 新しいノードを作成し、周辺の接続情報も解決する.
   * @returns ノード
   */
  public static create(row: Row, col: Column) {
    const node = new LinkNode(row, col);

    // 周辺 Node の 接続情報を更新する.
    node.restoreVertical();
    node.restoreHorizontal();

    return node;
  }

  /**
   * 上下の接続情報を変更し、自身を縦の関係からノードとして無効化する
   */
  public clearVertical() {
    if (this.col.origin === this) {
      this.col.setOrigin(this === this.down ? null : this.down);
    }
    this.up._down = this._down;
    this.down._up = this._up;

    this._up = this;
    this._down = this;
  }

  /**
   * 上下の接続情報を新しく作成
   */
  public restoreVertical() {
    if (this.col.origin) {
      this._up = this.col.origin.up;
      this._down = this.col.origin;
      this.col.origin.up._down = this;
      this.col.origin._up = this;
    } else {
      this.col.setOrigin(this);
    }
  }

  /**
   * 左右の接続情報を新しく作成
   */
  private restoreHorizontal() {
    if (this.row.origin) {
      this._left = this.row.origin.left;
      this._right = this.row.origin;
      this.row.origin.left._right = this;
      this.row.origin._left = this;
    } else {
      this.row.setOrigin(this);
    }
  }

  public get row() {
    return this._row;
  }

  public get col() {
    return this._col;
  }

  public get up() {
    return this._up;
  }

  public get down() {
    return this._down;
  }

  public get left() {
    return this._left;
  }

  public get right() {
    return this._right;
  }
}
