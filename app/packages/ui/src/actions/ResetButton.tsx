import {
  toolbarButtonClassName,
  toolbarButtonToneClassName,
} from "@sudoku/ui/actions/styles";
import type { SolveStatusType } from "@sudoku/ui/actions/types";
import { Button } from "@sudoku/ui/primitives/Button";
import { clsx } from "clsx";
import { RotateCcw } from "lucide-react";

type ResetButtonProps = {
  onReset: () => void;
  solveStatus: SolveStatusType;
};

export const ResetButton = ({ onReset, solveStatus }: ResetButtonProps) => {
  return (
    <Button
      disabled={solveStatus === "solving"}
      icon={RotateCcw}
      onClick={onReset}
      className={clsx(toolbarButtonClassName, toolbarButtonToneClassName.zinc)}
      text="Reset"
    />
  );
};
