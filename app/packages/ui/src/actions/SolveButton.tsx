import type { SudokuSolveStatusType } from "@sudoku/ui/actions/types";
import { Button } from "@sudoku/ui/primitives/Button";
import { clsx } from "clsx";
import { Square, WandSparkles } from "lucide-react";

const toolbarButtonClassName =
  "inline-flex items-center gap-1 rounded border px-2 py-1.5 text-xs font-medium transition-colors disabled:cursor-wait disabled:opacity-60 sm:gap-2 sm:px-4 sm:py-2 sm:text-base";

type SolveButtonProps = {
  onSolve: () => void;
  onStop: () => void;
  solveStatus: SudokuSolveStatusType;
};

export const SolveButton = ({
  onSolve,
  onStop,
  solveStatus,
}: SolveButtonProps) => {
  const processing = solveStatus === "solving";

  return (
    <Button
      className={clsx(
        toolbarButtonClassName,
        processing
          ? "border-red-600 text-red-600 hover:bg-red-50"
          : "border-cyan-600 text-cyan-600 hover:bg-cyan-50",
      )}
      icon={processing ? Square : WandSparkles}
      onClick={processing ? onStop : onSolve}
      text={processing ? "Stop" : "Solve"}
    />
  );
};
