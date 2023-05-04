import { Column } from "@/algorithm/dancinglinks/Column";
import { LinkNode } from "@/algorithm/dancinglinks/LinkNode";
import { Row } from "@/algorithm/dancinglinks/Row";


export class Matrix {

  private headers: Set<Column>;

  constructor(headers: Set<Column>) {
    this.headers = headers;
  }

  public select(leadingRow: Row) {
    // 現在の戦略に矛盾が生じた際に元の状態を復元するためのリスト
    const restorationsList: LinkNode[][] = [];
    for (const { col } of leadingRow.getForwardNodes()) {
      const restorations: LinkNode[] = [];
      for (const node of col.getForwardNodes()) {
        restorations.push(node);
        node.row.clear();
      }
      restorationsList.push(restorations);
      this.headers.delete(col);
    }

    return restorationsList;
  }

  public deselect(leadingRow: Row, restorationsList: LinkNode[][]) {
    for (const { col } of leadingRow.getReverseNodes()) {
      const restorations = restorationsList.pop();
      if (restorations) {
        this.headers.add(col);
        for (const { row } of restorations) {
          row.restore();
        }
      }
    }
  }

  /**
   * ExactCover問題のSolver
   * 
   * @param solution 現在仮定している解の部分
   * @returns 得られた解
   */
  public *solveExactCover(solution: Row[]): IterableIterator<Row[]> {
    if (this.headers.size === 0) {
      yield solution;
    } else {
      const minCol = Array.from(this.headers).reduce((accumulator, current) =>
        accumulator.size < current.size ? accumulator : current
      );
      for (const { row } of minCol.getForwardNodes()) {
        solution.push(row);
        const restorationsList = this.select(row);
        for (const rows of this.solveExactCover(solution)) {
          yield rows;
        }
        this.deselect(row, restorationsList);
        solution.pop();
      }
    }
  }
}