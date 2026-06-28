import type { SudokuSolveStatusType } from "@sudoku/ui/actions/types";
import { Button } from "@sudoku/ui/primitives/Button";
import { RotateCw, Shuffle } from "lucide-react";

const toolbarButtonClassName =
  "inline-flex items-center gap-1 rounded border border-zinc-600 px-2 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-wait disabled:opacity-60 sm:gap-2 sm:px-4 sm:py-2 sm:text-base";

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
      className={toolbarButtonClassName}
      text={label}
    />
  );
};
