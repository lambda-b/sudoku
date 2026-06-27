import { useMutation } from "@tanstack/react-query";
import { useCallback, useContext, useEffect, useRef } from "react";
import { SudokuSolverClientContext } from "@/services/api/SudokuSolverClientProvider";
import type { SolutionStep, SolveResult } from "@/services/api/type";
import type { SolveStatus } from "@/services/type";

const REVEAL_INTERVAL_MS = 100;

type UseSudokuSolverOptions = {
  solveStatus: SolveStatus;
  table: string;
  onConflictsChange?: (conflicts: number[]) => void;
  onStatusChange?: (status: SolveStatus) => void;
  onTableChange: (table: string) => void;
};

type SolveVariables = {
  generation: number;
  puzzle: string;
};

export const useSudokuSolver = ({
  solveStatus,
  table,
  onConflictsChange,
  onStatusChange,
  onTableChange,
}: UseSudokuSolverOptions) => {
  const client = useContext(SudokuSolverClientContext);
  const interval = useRef<ReturnType<typeof setInterval>>(undefined);
  const generation = useRef(0);
  const originalTable = useRef("");
  const revealingTable = useRef<string[]>([]);

  const updateStatus = useCallback(
    (nextStatus: SolveStatus) => {
      onStatusChange?.(nextStatus);
    },
    [onStatusChange],
  );

  const updateConflicts = useCallback(
    (nextConflicts: number[]) => {
      onConflictsChange?.(nextConflicts);
    },
    [onConflictsChange],
  );

  const dispose = useCallback(() => {
    generation.current += 1;
    clearInterval(interval.current);
  }, []);

  useEffect(() => dispose, [dispose]);

  const reveal = useCallback(
    (steps: SolutionStep[]) => {
      if (steps.length === 0) {
        updateStatus("solved");
        return;
      }

      const iterator = steps[Symbol.iterator]();
      interval.current = setInterval(() => {
        const next = iterator.next();
        if (next.done) {
          clearInterval(interval.current);
          updateStatus("solved");
          return;
        }

        revealingTable.current[next.value.address] = String(next.value.value);
        onTableChange(revealingTable.current.join(""));
      }, REVEAL_INTERVAL_MS);
    },
    [onTableChange, updateStatus],
  );

  const mutation = useMutation<SolveResult, Error, SolveVariables>({
    mutationFn: ({ puzzle }) => {
      if (!client) {
        throw new Error("SudokuSolverClientProvider is not found");
      }

      return client.solve(puzzle);
    },
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
        updateConflicts(result.conflicts);
      } else {
        onTableChange(originalTable.current);
      }
      updateStatus(result.status);
    },
    onError: (_error, variables) => {
      if (variables.generation !== generation.current) {
        return;
      }

      clearInterval(interval.current);
      onTableChange(originalTable.current);
      updateStatus("error");
    },
  });

  const solve = useCallback(() => {
    if (solveStatus === "solving") {
      return;
    }

    generation.current += 1;
    clearInterval(interval.current);
    originalTable.current = table;
    revealingTable.current = table.split("");
    updateConflicts([]);
    updateStatus("solving");

    const currentGeneration = generation.current;
    mutation.mutate({
      generation: currentGeneration,
      puzzle: table,
    });
  }, [mutation, solveStatus, table, updateConflicts, updateStatus]);

  const stop = useCallback(() => {
    dispose();
    mutation.reset();
    updateStatus("stopped");
  }, [dispose, mutation, updateStatus]);

  return {
    solve,
    stop,
  };
};
