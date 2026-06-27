import { clsx } from "clsx";
import { useAtomValue, useSetAtom } from "jotai";
import { useContext, useEffect } from "react";
import { cellStatusUpdater, tableState } from "@/base/jotai/cell";
import { solveStatusState } from "@/base/jotai/solver";
import { SudokuSolverClientContext } from "@/services/api/SudokuSolverClientProvider";
import { useSudokuSolver } from "@/services/useSudokuSolver";

const requireSudokuSolverClient = () => {
  throw new Error("SudokuSolverClientProvider is not found");
};

export const SudokuSolveButton = () => {
  const client =
    useContext(SudokuSolverClientContext) ?? requireSudokuSolverClient();
  const table = useAtomValue(tableState);
  const setTable = useSetAtom(tableState);
  const setSolveStatus = useSetAtom(solveStatusState);
  const setCellStatuses = useSetAtom(cellStatusUpdater);

  const { conflicts, solve, status, stop } = useSudokuSolver({
    client,
    table,
    onTableChange: setTable,
  });
  const processing = status === "solving";

  useEffect(() => setSolveStatus(status), [setSolveStatus, status]);
  useEffect(() => setCellStatuses(conflicts), [conflicts, setCellStatuses]);

  return (
    <button
      className={clsx(
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
