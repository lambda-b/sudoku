import SudokuTemplate from "@/calc/SudokuTemplate";
import { SudokuCellModel } from "@/model/SudokuCellModel";

class SudokuSolver {
  private dispatch: (param: SudokuCellModel) => void;

  constructor(dispatch: (param: SudokuCellModel) => void) {
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