import { cellNumberState } from '@/base/recoil/cell';
import { ClassNamesArg, cx } from "@emotion/css";
import { useSetRecoilState } from 'recoil';


export interface SudokuButtonProps {
  className?: ClassNamesArg;
  cellNumber: number;
}

const SudokuButton = ({
  className = '',
  cellNumber,
}: SudokuButtonProps) => {

  const setCell = useSetRecoilState(cellNumberState);

  const handleInput = () => {
    setCell(cellNumber);
  };

  return (
    <div className={cx("sudoku-cell", className)}>
      <button className="sudoku-cell-inner"
        onClick={handleInput}
      >
        {cellNumber}
      </button>
    </div>
  );
};

export default SudokuButton;
