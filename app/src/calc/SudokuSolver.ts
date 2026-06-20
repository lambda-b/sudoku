import SudokuTemplate from "@/calc/SudokuTemplate";
import { validateSudoku } from "@/calc/validateSudoku";
import type { GridOption } from "@/model/GridOption";

export type SudokuSolveResult =
  | { status: "invalid"; conflicts: number[] }
  | { status: "no-solution" }
  | { status: "unique"; solution: GridOption[] }
  | { status: "multiple-solutions" };

class SudokuSolver {
  solve(data: string): SudokuSolveResult {
    const validation = validateSudoku(data);
    if (!validation.valid) {
      return { status: "invalid", conflicts: validation.conflicts };
    }

    const template = new SudokuTemplate();
    template.setup(data);
    let firstSolution: GridOption[] | undefined;

    for (const solution of template.solveSudoku()) {
      if (firstSolution) {
        return { status: "multiple-solutions" };
      }
      firstSolution = solution;
    }

    if (!firstSolution) {
      return { status: "no-solution" };
    }
    return { status: "unique", solution: firstSolution };
  }
}

export default SudokuSolver;
