import { SudokuDataAction } from "@/base/reducer";
import SudokuTemplate from "@/calc/SudokuTemplate";
import { Dispatch } from "react";

class SudokuSolver {
  private proxy: SudokuTemplate = new SudokuTemplate();

  private dispatch: Dispatch<SudokuDataAction>;

  constructor(dispatch: Dispatch<SudokuDataAction>) {
    this.dispatch = dispatch;
  }

  public *solve(data: string) {
    this.proxy.initialize();
    this.proxy.preSelectGridOption(data);
    const matrix = this.proxy.beanMatrix;

    for (const solution of matrix.solveExactCover([])) {
      for (const { gridOption } of solution) {
        const { row, col, num } = gridOption;
        const address = row * 9 + col;
        const cellNumber = num;
        this.dispatch({ address, cellNumber });
        yield;
      }
    }
  }
}

export default SudokuSolver;