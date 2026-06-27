import SudokuTemplate from "@sudoku/core/calc/SudokuTemplate";
import { expose } from "comlink";
import type {
  SolutionStep,
  SolveResult,
  SudokuSolverApi,
} from "@/services/api/type";
import { validate } from "@/services/api/validate";

const api: SudokuSolverApi = {
  solve: async (puzzle): Promise<SolveResult> => {
    const validation = validate(puzzle);
    if (!validation.valid) {
      return { status: "invalid", conflicts: validation.conflicts };
    }

    const template = new SudokuTemplate();
    template.setup(puzzle);
    let solutionCount = 0;
    let firstSolution: SolutionStep[] = [];

    for (const solution of template.solveSudoku()) {
      solutionCount += 1;

      if (solutionCount === 1) {
        firstSolution = solution.map(({ row, col, num }) => ({
          address: row * 9 + col,
          value: num,
        }));
        continue;
      }

      return { status: "multiple-solutions" };
    }

    if (solutionCount === 0) {
      return { status: "no-solution" };
    }

    return { status: "success", solution: firstSolution };
  },
};

expose(api);
