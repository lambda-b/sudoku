import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { cx } from "@/base/function";
import { cellUpdater, tableState } from "@/base/jotai/cell";
import SudokuSolver from "@/calc/SudokuSolver";

export const SudokuSolveButton = () => {
  const data = useAtomValue(tableState);

  const setCell = useSetAtom(cellUpdater);

  const [solver] = useState<SudokuSolver>(new SudokuSolver(setCell));

  const [processing, setProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (processing) {
      const itr = solver.solve(data);

      const exe = setInterval(() => {
        if (itr.next().done) {
          clearInterval(exe);
        }
      }, 100);

      return () => clearInterval(exe);
    }
  }, [processing, data, solver]);

  return (
    <button
      className={cx(
        "my-3 cursor-pointer rounded border px-4 py-2 font-medium transition-colors",
        processing
          ? "border-red-600 text-red-600 hover:bg-red-50"
          : "border-cyan-600 text-cyan-600 hover:bg-cyan-50",
      )}
      onClick={() => setProcessing((b) => !b)}
      type="button"
    >
      {processing ? "Stop" : "Solve"}
    </button>
  );
};
