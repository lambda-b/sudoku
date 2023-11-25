import { cellWholeState, tableState } from "@/base/recoil";
import SudokuSolver from "@/calc/SudokuSolver";
import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

export const SudokuSolveButton = () => {

  const data = useRecoilValue(tableState);

  const setCell = useSetRecoilState(cellWholeState);

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