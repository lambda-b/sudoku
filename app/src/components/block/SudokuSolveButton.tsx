import { clsx } from "clsx";
import { Square, WandSparkles } from "lucide-react";
import type { SolveStatus } from "@/services/solver/type";

type SudokuSolveButtonProps = {
  onSolve: () => void;
  onStop: () => void;
  solveStatus: SolveStatus;
};

export const SudokuSolveButton = ({
  onSolve,
  onStop,
  solveStatus,
}: SudokuSolveButtonProps) => {
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
      onClick={processing ? onStop : onSolve}
      type="button"
    >
      <Icon aria-hidden="true" size={16} strokeWidth={2} />
      {processing ? "Stop" : "Solve"}
    </button>
  );
};
