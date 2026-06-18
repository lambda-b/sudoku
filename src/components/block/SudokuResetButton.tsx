import { useAtomValue, useSetAtom } from "jotai";
import { puzzleState, tableState } from "@/base/jotai/cell";

export const SudokuResetButton = () => {
  const puzzle = useAtomValue(puzzleState);
  const setTable = useSetAtom(tableState);

  return (
    <button
      className="cursor-pointer rounded border border-zinc-600 px-4 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
      onClick={() => setTable(puzzle)}
      type="button"
    >
      Reset
    </button>
  );
};
