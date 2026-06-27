import { RotateCcw } from "lucide-react";
import type { SolveStatus } from "@/services/type";

type SudokuResetButtonProps = {
  onReset: () => void;
  solveStatus: SolveStatus;
};

export const SudokuResetButton = ({
  onReset,
  solveStatus,
}: SudokuResetButtonProps) => {
  return (
    <button
      className="inline-flex cursor-pointer items-center gap-2 rounded border border-zinc-600 px-4 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
      disabled={solveStatus === "solving"}
      onClick={onReset}
      type="button"
    >
      <RotateCcw aria-hidden="true" size={16} strokeWidth={2} />
      Reset
    </button>
  );
};
