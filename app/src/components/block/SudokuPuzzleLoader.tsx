import { useQuery } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { RotateCw, Shuffle } from "lucide-react";
import { useEffect } from "react";
import { puzzleState, tableState } from "@/base/jotai/cell";
import { solveStatusState } from "@/base/jotai/solver";

type SudokuPuzzle = {
  id: string;
  puzzle: string;
  solution: string;
};

const fetchRandomPuzzle = async () => {
  const response = await fetch("/api/puzzles/random", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch puzzle");
  }

  return response.json() as Promise<SudokuPuzzle>;
};

export const SudokuPuzzleLoader = () => {
  const setTable = useSetAtom(tableState);
  const setPuzzle = useSetAtom(puzzleState);
  const [solveStatus, setSolveStatus] = useAtom(solveStatusState);
  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["puzzles", "random"],
    queryFn: fetchRandomPuzzle,
    refetchOnWindowFocus: false,
  });
  const label = isError ? "Retry" : isFetching ? "Loading" : "Random";
  const Icon = isError ? RotateCw : Shuffle;

  useEffect(() => {
    if (data) {
      setSolveStatus("idle");
      setPuzzle(data.puzzle);
      setTable(data.puzzle);
    }
  }, [data, setPuzzle, setSolveStatus, setTable]);

  return (
    <button
      className="inline-flex cursor-pointer items-center gap-2 rounded border border-zinc-600 px-4 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-wait disabled:opacity-60"
      disabled={isFetching || solveStatus === "solving"}
      onClick={() => refetch()}
      type="button"
    >
      <Icon aria-hidden="true" size={16} strokeWidth={2} />
      {label}
    </button>
  );
};
