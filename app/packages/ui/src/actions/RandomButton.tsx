import type { SudokuSolveStatusType } from "@sudoku/ui/actions/types";
import { Button } from "@sudoku/ui/primitives/Button";
import { RotateCw, Shuffle } from "lucide-react";

type RandomButtonProps = {
  error: boolean;
  loading: boolean;
  onLoad: () => void;
  solveStatus: SudokuSolveStatusType;
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
      size="toolbar"
      text={label}
    />
  );
};
