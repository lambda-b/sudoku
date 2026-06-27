import { type Remote, wrap } from "comlink";
import type { SolveResult, SudokuSolverApi } from "@/services/solver/api/type";

export class SudokuSolverClient {
  readonly #worker: Worker;
  readonly #api: Remote<SudokuSolverApi>;

  constructor() {
    this.#worker = new Worker(new URL("./solver.worker.ts", import.meta.url), {
      type: "module",
    });
    this.#api = wrap<SudokuSolverApi>(this.#worker);
  }

  solve(puzzle: string): Promise<SolveResult> {
    return this.#api.solve(puzzle);
  }
}
