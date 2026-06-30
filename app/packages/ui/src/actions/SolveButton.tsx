import {
  toolbarButtonClassName,
  toolbarButtonToneClassName,
} from "@sudoku/ui/actions/styles";
import type { SolveStatusType } from "@sudoku/ui/actions/types";
import { Button } from "@sudoku/ui/primitives/Button";
import { clsx } from "clsx";
import { Square, WandSparkles } from "lucide-react";

type SolveButtonProps = {
  onSolve: () => void;
  onStop: () => void;
  solveStatus: SolveStatusType;
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
          ? toolbarButtonToneClassName.red
          : toolbarButtonToneClassName.cyan,
      )}
      icon={processing ? Square : WandSparkles}
      onClick={processing ? onStop : onSolve}
      text={processing ? "Stop" : "Solve"}
    />
  );
};
