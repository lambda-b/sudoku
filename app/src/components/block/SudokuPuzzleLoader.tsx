import { RotateCw, Shuffle } from "lucide-react";
import type { SolveStatus } from "@/services/solver/type";

type SudokuPuzzleLoaderProps = {
  error: boolean;
  loading: boolean;
  onLoad: () => void;
  solveStatus: SolveStatus;
};

export const SudokuPuzzleLoader = ({
  error,
  loading,
  onLoad,
  solveStatus,
}: SudokuPuzzleLoaderProps) => {
  const label = error ? "Retry" : loading ? "Loading" : "Random";
  const Icon = error ? RotateCw : Shuffle;

  return (
    <button
      className="inline-flex cursor-pointer items-center gap-2 rounded border border-zinc-600 px-4 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-wait disabled:opacity-60"
      disabled={loading || solveStatus === "solving"}
      onClick={onLoad}
      type="button"
    >
      <Icon aria-hidden="true" size={16} strokeWidth={2} />
      {label}
    </button>
  );
};
