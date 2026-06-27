import { createContext, type ReactNode } from "react";
import type { SudokuSolverClient } from "@/services/solver/api/client";

export const SudokuSolverClientContext =
  createContext<SudokuSolverClient | null>(null);

type SudokuSolverClientProviderProps = {
  children: ReactNode;
  client: SudokuSolverClient;
};

export const SudokuSolverClientProvider = ({
  children,
  client,
}: SudokuSolverClientProviderProps) => (
  <SudokuSolverClientContext value={client}>
    {children}
  </SudokuSolverClientContext>
);
