import { Cell } from "@/base/recoil";
import SudokuTemplate from "@/calc/SudokuTemplate";
import { SetterOrUpdater } from "recoil";

class SudokuSolver {
  private dispatch: SetterOrUpdater<Cell | undefined>;

  constructor(dispatch: SetterOrUpdater<Cell | undefined>) {
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
        const isSelected = false;
        this.dispatch({ address, cellNumber, isSelected });
        yield;
      }
    }
  }
}

export default SudokuSolver;