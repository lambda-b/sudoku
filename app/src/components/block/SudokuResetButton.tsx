import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { RotateCcw } from "lucide-react";
import { puzzleState, tableState } from "@/base/jotai/cell";
import { solveStatusState } from "@/base/jotai/solver";

export const SudokuResetButton = () => {
  const puzzle = useAtomValue(puzzleState);
  const setTable = useSetAtom(tableState);
  const [solveStatus, setSolveStatus] = useAtom(solveStatusState);

  return (
    <button
      className="inline-flex cursor-pointer items-center gap-2 rounded border border-zinc-600 px-4 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
      disabled={solveStatus === "solving"}
      onClick={() => {
        setSolveStatus("idle");
        setTable(puzzle);
      }}
      type="button"
    >
      <RotateCcw aria-hidden="true" size={16} strokeWidth={2} />
      Reset
    </button>
  );
};
