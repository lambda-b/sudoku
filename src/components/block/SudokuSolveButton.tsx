import { Cell, cellState, tableState } from "@/base/recoil";
import SudokuSolver from "@/calc/SudokuSolver";
import { useState } from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";

export const SudokuSolveButton = () => {

  const data = useRecoilValue(tableState);

  const setCell = useRecoilCallback(({ set }) => {
    return (cell: Cell) => set(cellState(cell.address), cell);
  }, []);

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