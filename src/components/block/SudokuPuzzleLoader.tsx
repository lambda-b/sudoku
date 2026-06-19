import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { puzzleState, tableState } from "@/base/jotai/cell";

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
  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["puzzles", "random"],
    queryFn: fetchRandomPuzzle,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setPuzzle(data.puzzle);
      setTable(data.puzzle);
    }
  }, [data, setPuzzle, setTable]);

  return (
    <button
      className="cursor-pointer rounded border border-zinc-600 px-4 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-wait disabled:opacity-60"
      disabled={isFetching}
      onClick={() => refetch()}
      type="button"
    >
      {isError ? "Retry" : isFetching ? "Loading" : "Random"}
    </button>
  );
};
