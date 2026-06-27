import { expose } from "comlink";
import SudokuTemplate from "@/calc/SudokuTemplate";
import type { SolveResult, SudokuSolverApi } from "@/services/api/type";
import { validateSudoku } from "@/services/api/validateSudoku";

const api: SudokuSolverApi = {
  solve: async (puzzle, onSolution): Promise<SolveResult> => {
    const validation = validateSudoku(puzzle);
    if (!validation.valid) {
      return { status: "invalid", conflicts: validation.conflicts };
    }

    const template = new SudokuTemplate();
    template.setup(puzzle);
    let solutionCount = 0;

    for (const solution of template.solveSudoku()) {
      solutionCount += 1;

      if (solutionCount === 1) {
        await onSolution(
          solution.map(({ row, col, num }) => ({
            address: row * 9 + col,
            value: num,
          })),
        );
        continue;
      }

      return { status: "multiple-solutions" };
    }

    return { status: solutionCount === 1 ? "unique" : "no-solution" };
  },
};

expose(api);
