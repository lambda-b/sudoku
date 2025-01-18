import { cellNumberState } from "@/base/jotai/cell";
import { cx } from "@emotion/css";
import { useSetAtom } from "jotai";

export interface SudokuButtonProps {
  className?: string;
  cellNumber: number;
}

const SudokuButton = ({
  className = '',
  cellNumber,
}: SudokuButtonProps) => {

  const setCell = useSetAtom(cellNumberState);

  const handleInput = () => {
    setCell(cellNumber);
  };

  return (
    <div className={cx("sudoku-cell", className)}>
      <button className="sudoku-cell-inner" onClick={handleInput}>
        {cellNumber}
      </button>
    </div>
  );
};

export default SudokuButton;
