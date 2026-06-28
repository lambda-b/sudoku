import type { SudokuSolveStatusType } from "@sudoku/ui/actions/types";
import { Button } from "@sudoku/ui/primitives/Button";
import { RotateCcw } from "lucide-react";

type ResetButtonProps = {
  onReset: () => void;
  solveStatus: SudokuSolveStatusType;
};

export const ResetButton = ({ onReset, solveStatus }: ResetButtonProps) => {
  return (
    <Button
      disabled={solveStatus === "solving"}
      onClick={onReset}
      size="toolbar"
    >
      <RotateCcw
        aria-hidden="true"
        className="size-3.5 sm:size-4"
        strokeWidth={2}
      />
      Reset
    </Button>
  );
};
