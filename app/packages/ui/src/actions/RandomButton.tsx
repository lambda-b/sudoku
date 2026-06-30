import {
  toolbarButtonClassName,
  toolbarButtonToneClassName,
} from "@sudoku/ui/actions/styles";
import type { SolveStatusType } from "@sudoku/ui/actions/types";
import { Button } from "@sudoku/ui/primitives/Button";
import { clsx } from "clsx";
import { RotateCw, Shuffle } from "lucide-react";

type RandomButtonProps = {
  error: boolean;
  loading: boolean;
  onLoad: () => void;
  solveStatus: SolveStatusType;
};

export const RandomButton = ({
  error,
  loading,
  onLoad,
  solveStatus,
}: RandomButtonProps) => {
  const label = error ? "Retry" : loading ? "Loading" : "Random";
  const Icon = error ? RotateCw : Shuffle;

  return (
    <Button
      disabled={loading || solveStatus === "solving"}
      icon={Icon}
      onClick={onLoad}
      className={clsx(toolbarButtonClassName, toolbarButtonToneClassName.zinc)}
      text={label}
    />
  );
};
