import type { SudokuSolveStatusType } from "@sudoku/ui/actions/types";
import { RotateCcw } from "lucide-react";

type SudokuResetButtonProps = {
  onReset: () => void;
  solveStatus: SudokuSolveStatusType;
};

export const SudokuResetButton = ({
  onReset,
  solveStatus,
}: SudokuResetButtonProps) => {
  return (
    <button
      className="inline-flex cursor-pointer items-center gap-1 rounded border border-zinc-600 px-2 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 sm:gap-2 sm:px-4 sm:py-2 sm:text-base"
      disabled={solveStatus === "solving"}
      onClick={onReset}
      type="button"
    >
      <RotateCcw
        aria-hidden="true"
        className="size-3.5 sm:size-4"
        strokeWidth={2}
      />
      Reset
    </button>
  );
};
