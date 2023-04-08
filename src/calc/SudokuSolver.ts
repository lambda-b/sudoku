import { SudokuDataAction } from "@/base/reducer";
import SudokuTemplate from "@/calc/SudokuTemplate";
import { Dispatch } from "react";

class SudokuSolver {
  private dispatch: Dispatch<SudokuDataAction>;

  constructor(dispatch: Dispatch<SudokuDataAction>) {
    this.dispatch = dispatch;
  }

  public *solve(data: string) {
    const template = new SudokuTemplate();
    template.setup(data);

    for (const solution of template.solveSudoku()) {
      for (const option of solution) {
        const { row, col, num } = option;
        const address = row * 9 + col;
        const cellNumber = num;
        this.dispatch({ address, cellNumber });
        yield;
      }
    }
  }
}

export default SudokuSolver;