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

  return (
    <Button
      icon={processing ? Square : WandSparkles}
      onClick={processing ? onStop : onSolve}
      size="toolbar"
      text={processing ? "Stop" : "Solve"}
      tone={processing ? "danger" : "primary"}
    />
  );
};
