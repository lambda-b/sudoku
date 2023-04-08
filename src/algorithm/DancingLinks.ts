import BaseModel from "@/utility/model/BaseModel";

namespace DancingLinks {

  export type Node<R extends Axis<R, C>, C extends Axis<R, C>> = [R, C];

  export interface Axis<R extends Axis<R, C>, C extends Axis<R, C>> extends BaseModel {
    size: number;
    clear: () => void;
    restore: (param: Node<R, C>[]) => void;
    getForwardNodes: () => IterableIterator<Node<R, C>>;
    getReverseNodes: () => IterableIterator<Node<R, C>>;
  }


  export class Matrix<R extends Axis<R, C>, C extends Axis<R, C>> {

    private headers: Set<C>;

    constructor(headers: Set<C>) {
      this.headers = headers;
    }

    public select(leadingRow: R) {
      // 現在の戦略に矛盾が生じた際に元の状態を復元するためのリスト
      const restorationsList: Node<R, C>[][] = [];
      for (const [_, col] of leadingRow.getForwardNodes()) {
        const restorations: Node<R, C>[] = [];
        for (const node of col.getForwardNodes()) {
          restorations.push(node);
          node[0].clear();
        }
        restorationsList.push(restorations);
        this.headers.delete(col);
      }

      return restorationsList;
    }

    public deselect(leadingRow: R, restorationsList: Node<R, C>[][]) {
      for (const [_, col] of leadingRow.getReverseNodes()) {
        const restorations = restorationsList.pop();
        if (restorations) {
          this.headers.add(col);
          for (const [row, _] of restorations) {
            const nodes = Array.from(row.getForwardNodes());
            row.restore(nodes);
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
    public *solveExactCover(solution: R[]): IterableIterator<R[]> {
      if (this.headers.size === 0) {
        yield solution;
      } else {
        const minCol = Array.from(this.headers).reduce((accumulator, current) =>
          accumulator.size < current.size ? accumulator : current
        );
        for (const [row, _] of minCol.getForwardNodes()) {
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
}

export default DancingLinks;
