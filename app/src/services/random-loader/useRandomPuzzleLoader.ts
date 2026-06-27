import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

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

type UseRandomPuzzleOptions = {
  onPuzzleLoad: (puzzle: string) => void;
};

export const useRandomPuzzleLoader = ({
  onPuzzleLoad,
}: UseRandomPuzzleOptions) => {
  const query = useQuery({
    queryKey: ["puzzles", "random"],
    queryFn: fetchRandomPuzzle,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.data) {
      onPuzzleLoad(query.data.puzzle);
    }
  }, [onPuzzleLoad, query.data]);

  return {
    error: query.isError,
    load: query.refetch,
    loading: query.isFetching,
  };
};
