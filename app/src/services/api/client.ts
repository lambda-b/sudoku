import { proxy, type Remote, wrap } from "comlink";
import type {
  OnSolution,
  SolveResult,
  SudokuSolverApi,
} from "@/services/api/type";

export class SudokuSolverClient {
  readonly #worker: Worker;
  readonly #api: Remote<SudokuSolverApi>;

  constructor() {
    this.#worker = new Worker(
      new URL("./sudokuSolver.worker.ts", import.meta.url),
      { type: "module" },
    );
    this.#api = wrap<SudokuSolverApi>(this.#worker);
  }

  solve(puzzle: string, onSolution: OnSolution): Promise<SolveResult> {
    return this.#api.solve(puzzle, proxy(onSolution));
  }
}
