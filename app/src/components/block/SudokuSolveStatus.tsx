import { clsx } from "clsx";
import type { SolveStatus } from "@/services/solver/type";

const messages: Record<SolveStatus, string> = {
  idle: "",
  solving: "求解中…",
  solved: "解けました",
  invalid: "数字が重複しています",
  "no-solution": "この盤面には解がありません",
  "multiple-solutions": "問題を確認できませんでした",
  stopped: "求解を停止しました",
  error: "求解中にエラーが発生しました",
};

type SudokuSolveStatusProps = {
  solveStatus: SolveStatus;
};

export const SudokuSolveStatus = ({ solveStatus }: SudokuSolveStatusProps) => {
  return (
    <p
      aria-live="polite"
      className={clsx(
        "min-w-72 text-right text-sm font-medium",
        solveStatus === "solved" && "text-emerald-700",
        (solveStatus === "invalid" || solveStatus === "no-solution") &&
          "text-red-700",
        (solveStatus === "multiple-solutions" || solveStatus === "stopped") &&
          "text-zinc-600",
        solveStatus === "error" && "text-red-700",
        solveStatus === "solving" && "text-cyan-700",
      )}
      role="status"
    >
      {messages[solveStatus]}
    </p>
  );
};
