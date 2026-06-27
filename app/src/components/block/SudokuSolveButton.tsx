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
        "inline-flex cursor-pointer items-center gap-1 rounded border px-2 py-1.5 text-xs font-medium transition-colors sm:gap-2 sm:px-4 sm:py-2 sm:text-base",
        processing
          ? "border-red-600 text-red-600 hover:bg-red-50"
          : "border-cyan-600 text-cyan-600 hover:bg-cyan-50",
      )}
      onClick={processing ? onStop : onSolve}
      type="button"
    >
      <Icon aria-hidden="true" className="size-3.5 sm:size-4" strokeWidth={2} />
      {processing ? "Stop" : "Solve"}
    </button>
  );
};
