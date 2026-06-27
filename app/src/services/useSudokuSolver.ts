import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SudokuSolverClient } from "@/services/api/client";
import type { SolutionStep, SolveResult } from "@/services/api/type";
import type { SolveStatus } from "@/services/type";

const REVEAL_INTERVAL_MS = 100;

type UseSudokuSolverOptions = {
  client: SudokuSolverClient;
  table: string;
  onTableChange: (table: string) => void;
};

type SolveVariables = {
  generation: number;
  puzzle: string;
};

export const useSudokuSolver = ({
  client,
  table,
  onTableChange,
}: UseSudokuSolverOptions) => {
  const [status, setStatus] = useState<SolveStatus>("idle");
  const [conflicts, setConflicts] = useState<number[]>([]);
  const interval = useRef<ReturnType<typeof setInterval>>(undefined);
  const generation = useRef(0);
  const originalTable = useRef("");
  const revealingTable = useRef<string[]>([]);

  const dispose = useCallback(() => {
    generation.current += 1;
    clearInterval(interval.current);
  }, []);

  useEffect(() => dispose, [dispose]);

  const reveal = useCallback(
    (steps: SolutionStep[]) => {
      if (steps.length === 0) {
        setStatus("solved");
        return;
      }

      const iterator = steps[Symbol.iterator]();
      interval.current = setInterval(() => {
        const next = iterator.next();
        if (next.done) {
          clearInterval(interval.current);
          setStatus("solved");
          return;
        }

        revealingTable.current[next.value.address] = String(next.value.value);
        onTableChange(revealingTable.current.join(""));
      }, REVEAL_INTERVAL_MS);
    },
    [onTableChange],
  );

  const mutation = useMutation<SolveResult, Error, SolveVariables>({
    mutationFn: ({ puzzle }) => client.solve(puzzle),
    onSuccess: (result, variables) => {
      if (variables.generation !== generation.current) {
        return;
      }

      if (result.status === "success") {
        reveal(result.solution);
        return;
      }

      clearInterval(interval.current);
      if (result.status === "invalid") {
        setConflicts(result.conflicts);
      } else {
        onTableChange(originalTable.current);
      }
      setStatus(result.status);
    },
    onError: (_error, variables) => {
      if (variables.generation !== generation.current) {
        return;
      }

      clearInterval(interval.current);
      onTableChange(originalTable.current);
      setStatus("error");
    },
  });

  const solve = useCallback(() => {
    if (status === "solving") {
      return;
    }

    generation.current += 1;
    clearInterval(interval.current);
    originalTable.current = table;
    revealingTable.current = table.split("");
    setConflicts([]);
    setStatus("solving");

    const currentGeneration = generation.current;
    mutation.mutate({
      generation: currentGeneration,
      puzzle: table,
    });
  }, [mutation, status, table]);

  const stop = useCallback(() => {
    dispose();
    mutation.reset();
    setStatus("stopped");
  }, [dispose, mutation]);

  return {
    conflicts,
    solve,
    status,
    stop,
  };
};
