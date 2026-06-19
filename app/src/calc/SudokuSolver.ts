import SudokuTemplate from "@/calc/SudokuTemplate";
import type { SudokuCellModel } from "@/model/SudokuCellModel";

class SudokuSolver {
  #dispatch: (param: SudokuCellModel) => void;

  constructor(dispatch: (param: SudokuCellModel) => void) {
    this.#dispatch = dispatch;
  }

  *solve(data: string) {
    const template = new SudokuTemplate();
    template.setup(data);

    for (const solution of template.solveSudoku()) {
      for (const option of solution) {
        const { row, col, num } = option;
        const address = row * 9 + col;
        const cellNumber = num;
        const isSelected = false;
        this.#dispatch({ address, cellNumber, isSelected });
        yield;
      }
    }
  }
}

export default SudokuSolver;
