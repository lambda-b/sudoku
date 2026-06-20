import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { puzzleState, tableState } from "@/base/jotai/cell";
import { conflictAddressesState, solveStatusState } from "@/base/jotai/solver";

export const SudokuResetButton = () => {
  const puzzle = useAtomValue(puzzleState);
  const setTable = useSetAtom(tableState);
  const [solveStatus, setSolveStatus] = useAtom(solveStatusState);
  const setConflicts = useSetAtom(conflictAddressesState);

  return (
    <button
      className="cursor-pointer rounded border border-zinc-600 px-4 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
      disabled={solveStatus === "solving"}
      onClick={() => {
        setSolveStatus("idle");
        setConflicts([]);
        setTable(puzzle);
      }}
      type="button"
    >
      Reset
    </button>
  );
};
