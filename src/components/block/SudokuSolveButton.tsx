import { cellUpdater, tableState } from "@/base/jotai/cell";
import SudokuSolver from "@/calc/SudokuSolver";
import { cx } from "@emotion/css";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

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
  }, [processing]);

  return (
    <button
      className={cx(
        "button is-outlined",
        processing ? "is-danger" : "is-primary"
      )}
      onClick={() => setProcessing((b) => !b)}
    >
      {processing ? "Stop" : "Solve"}
    </button>
  );
};
