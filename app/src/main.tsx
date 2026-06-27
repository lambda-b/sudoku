import Sudoku from "@/Sudoku";
import { SudokuSolverClient } from "@/services/solver/api/client";
import { SudokuSolverClientProvider } from "@/services/solver/api/SudokuSolverClientProvider";
import "@/style.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

const queryClient = new QueryClient();
const sudokuSolverClient = new SudokuSolverClient();

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SudokuSolverClientProvider client={sudokuSolverClient}>
        <Sudoku />
      </SudokuSolverClientProvider>
    </QueryClientProvider>
  </StrictMode>,
);
