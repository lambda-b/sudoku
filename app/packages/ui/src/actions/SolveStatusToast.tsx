import type { SolveStatusType } from "@sudoku/ui/actions/types";
import { Button } from "@sudoku/ui/primitives/Button";
import { Toast } from "@sudoku/ui/primitives/Toast";
import { Play, Square } from "lucide-react";

const messages: Record<SolveStatusType, string> = {
  idle: "",
  solving: "求解中…",
  solved: "解けました",
  invalid: "数字が重複しています",
  "no-solution": "この盤面には解がありません",
  "multiple-solutions": "問題を確認できませんでした",
  stopped: "求解を停止しました",
  error: "求解中にエラーが発生しました",
};

const tones: Record<SolveStatusType, "success" | "error" | "neutral" | "info"> =
  {
    idle: "neutral",
    solving: "info",
    solved: "success",
    invalid: "error",
    "no-solution": "error",
    "multiple-solutions": "neutral",
    stopped: "neutral",
    error: "error",
  };

type SolveStatusToastProps = {
  durationSeconds?: number;
  onSolve: () => void;
  onStop: () => void;
  solveStatus: SolveStatusType;
};

export const SolveStatusToast = ({
  durationSeconds,
  onSolve,
  onStop,
  solveStatus,
}: SolveStatusToastProps) => {
  const message = messages[solveStatus];
  const processing = solveStatus === "solving";
  const action = processing
    ? onStop
    : solveStatus === "stopped"
      ? onSolve
      : undefined;

  return (
    <Toast
      active={solveStatus === "idle" ? false : solveStatus}
      closeLabel="メッセージを閉じる"
      durationSeconds={durationSeconds}
      tone={tones[solveStatus]}
    >
      <div className="flex min-w-0 items-center justify-between gap-3">
        <span className="min-w-0">{message}</span>
        <div className="flex shrink-0 items-center gap-1">
          {action && (
            <Button
              className={
                processing
                  ? "inline-flex h-7 cursor-pointer items-center gap-1 rounded border border-red-200 px-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                  : "inline-flex h-7 cursor-pointer items-center gap-1 rounded border border-cyan-200 px-2 text-xs font-semibold text-cyan-700 transition-colors hover:bg-cyan-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700"
              }
              icon={processing ? Square : Play}
              onClick={action}
              text={processing ? "Stop" : "Resume"}
            />
          )}
        </div>
      </div>
    </Toast>
  );
};
