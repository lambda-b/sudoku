import { Column } from "@sudoku/solver/algorithm/dancinglinks/Column";
import { Restores } from "@sudoku/solver/algorithm/dancinglinks/Restores";
import type { Row } from "@sudoku/solver/algorithm/dancinglinks/Row";

export class Matrix {
  #headers: Set<Column>;

  constructor(headers: Set<Column>) {
    this.#headers = headers;
  }

  select(selected: Row) {
    // 現在の戦略に矛盾が生じた際に元の状態を復元するためのリスト
    const restorationsList: Restores[] = [];
    for (const { col } of selected) {
      const restorations = new Restores(col);
      for (const node of col) {
        restorations.push(node);
        node.row.clear();
      }
      restorationsList.push(restorations);
      this.#headers.delete(col);
    }

    return restorationsList;
  }

  deselect(restorationsList: Restores[]) {
    for (const restorations of restorationsList.reverse()) {
      if (restorations) {
        this.#headers.add(restorations.col);
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
  *solveExactCover(solution: Row[]): IterableIterator<Row[]> {
    if (this.#headers.size === 0) {
      yield solution;
    } else {
      const minCol = Column.minimum(this.#headers);
      for (const { row } of minCol ?? []) {
        solution.push(row);
        const restorationsList = this.select(row);
        for (const rows of this.solveExactCover(solution)) {
          yield rows;
        }
        this.deselect(restorationsList);
        solution.pop();
      }
    }
  }
}
