import type { SudokuSolveStatusType } from "@sudoku/ui/actions/types";
import { Button } from "@sudoku/ui/primitives/Button";
import { Square, WandSparkles } from "lucide-react";

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
  const Icon = processing ? Square : WandSparkles;

  return (
    <Button
      onClick={processing ? onStop : onSolve}
      size="toolbar"
      tone={processing ? "danger" : "primary"}
    >
      <Icon aria-hidden="true" className="size-3.5 sm:size-4" strokeWidth={2} />
      {processing ? "Stop" : "Solve"}
    </Button>
  );
};
