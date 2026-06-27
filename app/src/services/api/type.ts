export type SolveStep = {
  address: number;
  value: number;
};

export type SolveResult =
  | { status: "invalid"; conflicts: number[] }
  | { status: "unique" }
  | { status: "no-solution" }
  | { status: "multiple-solutions" };

export type OnSolution = (steps: SolveStep[]) => void | Promise<void>;

export interface SudokuSolverApi {
  solve(puzzle: string, onSolution: OnSolution): Promise<SolveResult>;
}
