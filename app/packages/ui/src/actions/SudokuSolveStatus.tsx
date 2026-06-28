import type { SudokuSolveStatusType } from "@sudoku/ui/actions/types";
import { clsx } from "clsx";
import { Play, Square, X } from "lucide-react";
import { useEffect, useState } from "react";

const messages: Record<SudokuSolveStatusType, string> = {
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
  onSolve?: () => void;
  onStop?: () => void;
  solveStatus: SudokuSolveStatusType;
};

export const SudokuSolveStatus = ({
  onSolve,
  onStop,
  solveStatus,
}: SudokuSolveStatusProps) => {
  const [visibleStatus, setVisibleStatus] =
    useState<SudokuSolveStatusType>("idle");
  const [open, setOpen] = useState(false);
  const message = messages[visibleStatus];

  useEffect(() => {
    if (solveStatus === "idle") {
      return;
    }

    setVisibleStatus(solveStatus);
    setOpen(true);
  }, [solveStatus]);

  if (!open || !message) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className={clsx(
        "fixed top-3 left-1/2 z-50 flex w-[min(360px,calc(100vw-24px))] -translate-x-1/2 items-center justify-between gap-3 rounded-md border bg-white px-3 py-2 text-left text-sm leading-tight font-medium shadow-lg",
        visibleStatus === "solved" && "border-emerald-200 text-emerald-800",
        (visibleStatus === "invalid" || visibleStatus === "no-solution") &&
          "border-red-200 text-red-800",
        (visibleStatus === "multiple-solutions" ||
          visibleStatus === "stopped") &&
          "border-zinc-200 text-zinc-700",
        visibleStatus === "error" && "border-red-200 text-red-800",
        visibleStatus === "solving" && "border-cyan-200 text-cyan-800",
      )}
      role="status"
    >
      <span className="min-w-0">{message}</span>
      <div className="flex shrink-0 items-center gap-1">
        {visibleStatus === "solving" && onStop && (
          <button
            className="inline-flex h-7 cursor-pointer items-center gap-1 rounded border border-red-200 px-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            onClick={onStop}
            type="button"
          >
            <Square
              aria-hidden="true"
              className="h-3.5 w-3.5"
              strokeWidth={2}
            />
            Stop
          </button>
        )}
        {visibleStatus === "stopped" && onSolve && (
          <button
            className="inline-flex h-7 cursor-pointer items-center gap-1 rounded border border-cyan-200 px-2 text-xs font-semibold text-cyan-700 transition-colors hover:bg-cyan-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700"
            onClick={onSolve}
            type="button"
          >
            <Play aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
            Resume
          </button>
        )}
        <button
          aria-label="メッセージを閉じる"
          className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded text-current opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
          onClick={() => setOpen(false)}
          type="button"
        >
          <X aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};
