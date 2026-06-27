import { clsx } from "clsx";
import { Square, WandSparkles } from "lucide-react";
import type { SolveStatus } from "@/services/type";
import { useSudokuSolver } from "@/services/useSudokuSolver";

type SudokuSolveButtonProps = {
  onSolveStatusChange: (status: SolveStatus) => void;
  onTableChange: (table: string) => void;
  onUpdateCellStatuses: (conflicts: number[]) => void;
  solveStatus: SolveStatus;
  table: string;
};

export const SudokuSolveButton = ({
  onSolveStatusChange,
  onTableChange,
  onUpdateCellStatuses,
  solveStatus,
  table,
}: SudokuSolveButtonProps) => {
  const { solve, stop } = useSudokuSolver({
    onConflictsChange: onUpdateCellStatuses,
    onStatusChange: onSolveStatusChange,
    onTableChange,
    solveStatus,
    table,
  });
  const processing = solveStatus === "solving";
  const Icon = processing ? Square : WandSparkles;

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
