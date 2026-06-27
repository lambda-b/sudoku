import { clsx } from "clsx";
import { Square, WandSparkles } from "lucide-react";
import { useContext, useEffect } from "react";
import { SudokuSolverClientContext } from "@/services/api/SudokuSolverClientProvider";
import type { SolveStatus } from "@/services/type";
import { useSudokuSolver } from "@/services/useSudokuSolver";

const requireSudokuSolverClient = () => {
  throw new Error("SudokuSolverClientProvider is not found");
};

type SudokuSolveButtonProps = {
  onSolveStatusChange: (status: SolveStatus) => void;
  onTableChange: (table: string) => void;
  onUpdateCellStatuses: (conflicts: number[]) => void;
  table: string;
};

export const SudokuSolveButton = ({
  onSolveStatusChange,
  onTableChange,
  onUpdateCellStatuses,
  table,
}: SudokuSolveButtonProps) => {
  const client =
    useContext(SudokuSolverClientContext) ?? requireSudokuSolverClient();

  const { conflicts, solve, status, stop } = useSudokuSolver({
    client,
    table,
    onTableChange,
  });
  const processing = status === "solving";
  const Icon = processing ? Square : WandSparkles;

  useEffect(() => onSolveStatusChange(status), [onSolveStatusChange, status]);
  useEffect(
    () => onUpdateCellStatuses(conflicts),
    [conflicts, onUpdateCellStatuses],
  );

  return (
    <button
      className={clsx(
        "inline-flex cursor-pointer items-center gap-2 rounded border px-4 py-2 font-medium transition-colors",
        processing
          ? "border-red-600 text-red-600 hover:bg-red-50"
          : "border-cyan-600 text-cyan-600 hover:bg-cyan-50",
      )}
      onClick={processing ? stop : solve}
      type="button"
    >
      <Icon aria-hidden="true" size={16} strokeWidth={2} />
      {processing ? "Stop" : "Solve"}
    </button>
  );
};
