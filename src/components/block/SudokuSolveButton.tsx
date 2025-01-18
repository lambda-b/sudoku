import { cellUpdater, tableState } from "@/base/jotai/cell";
import SudokuSolver from "@/calc/SudokuSolver";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";

export const SudokuSolveButton = () => {

  const data = useAtomValue(tableState);

  const setCell = useSetAtom(cellUpdater);

  const [solver] = useState<SudokuSolver>(new SudokuSolver(setCell));

  const onClickSolve = () => {
    const itr = solver.solve(data);

    const exe = setInterval(() => {
      if (itr.next().done) {
        clearInterval(exe);
      }
    }, 100);
  };

  return <button
    className="button"
    onClick={onClickSolve}
  >Solve</button>;
};