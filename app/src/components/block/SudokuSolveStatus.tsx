import { useAtomValue } from "jotai";
import { cx } from "@/base/function";
import { solveStatusState } from "@/base/jotai/solver";
import type { SolveStatus } from "@/services/type";

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

export const SudokuSolveStatus = () => {
  const status = useAtomValue(solveStatusState);

  return (
    <p
      aria-live="polite"
      className={cx(
        "min-w-72 text-right text-sm font-medium",
        status === "solved" && "text-emerald-700",
        (status === "invalid" || status === "no-solution") && "text-red-700",
        (status === "multiple-solutions" || status === "stopped") &&
          "text-zinc-600",
        status === "error" && "text-red-700",
        status === "solving" && "text-cyan-700",
      )}
      role="status"
    >
      {messages[status]}
    </p>
  );
};
