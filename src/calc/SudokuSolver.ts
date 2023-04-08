import { SudokuDataAction } from "@/base/reducer";
import SudokuConfig from "@/calc/SudokuConfig";
import { Dispatch } from "react";

class SudokuSolver {
  private config: SudokuConfig = new SudokuConfig;

  private dispatch: Dispatch<SudokuDataAction>;

  constructor(dispatch: Dispatch<SudokuDataAction>) {
    this.dispatch = dispatch;
  }

  public *solve(data: string) {
    this.config.initialize();
    this.config.preSelectGridOption(data);
    const matrix = this.config.beanMatrix;

    for (const solution of matrix.solveExactCover([])) {
      for (const { gridOption } of solution) {
        const { row, col, num } = gridOption;
        const address = row * 9 + col;
        const cellNumber = num;
        this.dispatch({ address, cellNumber });
        yield;
      }
    }
  };
}

export default SudokuSolver;