import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { cx } from "@/base/function";
import { cellUpdater, tableState } from "@/base/jotai/cell";
import { conflictAddressesState, solveStatusState } from "@/base/jotai/solver";
import SudokuSolver from "@/calc/SudokuSolver";

export const SudokuSolveButton = () => {
  const data = useAtomValue(tableState);
  const setCell = useSetAtom(cellUpdater);
  const [solver] = useState(() => new SudokuSolver());
  const [status, setStatus] = useAtom(solveStatusState);
  const setConflicts = useSetAtom(conflictAddressesState);
  const interval = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    return () => clearInterval(interval.current);
  }, []);

  const stop = () => {
    clearInterval(interval.current);
    setStatus("stopped");
  };

  const solve = () => {
    const result = solver.solve(data);
    setConflicts(result.status === "invalid" ? result.conflicts : []);
    if (result.status !== "unique") {
      setStatus(result.status);
      return;
    }

    if (result.solution.length === 0) {
      setStatus("solved");
      return;
    }

    setStatus("solving");
    const iterator = result.solution[Symbol.iterator]();

    interval.current = setInterval(() => {
      const next = iterator.next();
      if (next.done) {
        clearInterval(interval.current);
        setStatus("solved");
        return;
      }

      const { row, col, num } = next.value;
      setCell({
        address: row * 9 + col,
        cellNumber: num,
        isSelected: false,
      });
    }, 100);
  };

  const processing = status === "solving";

  return (
    <button
      className={cx(
        "cursor-pointer rounded border px-4 py-2 font-medium transition-colors",
        processing
          ? "border-red-600 text-red-600 hover:bg-red-50"
          : "border-cyan-600 text-cyan-600 hover:bg-cyan-50",
      )}
      onClick={processing ? stop : solve}
      type="button"
    >
      {processing ? "Stop" : "Solve"}
    </button>
  );
};
