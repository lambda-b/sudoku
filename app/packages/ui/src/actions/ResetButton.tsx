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
      icon={RotateCcw}
      onClick={onReset}
      size="toolbar"
      text="Reset"
    />
  );
};
