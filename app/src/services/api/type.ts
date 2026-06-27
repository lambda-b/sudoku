export type SolutionStep = {
  address: number;
  value: number;
};

export type SolveResult =
  | { status: "invalid"; conflicts: number[] }
  | { status: "success"; solution: SolutionStep[] }
  | { status: "no-solution" }
  | { status: "multiple-solutions" };

export interface SudokuSolverApi {
  solve(puzzle: string): Promise<SolveResult>;
}
