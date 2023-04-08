import { SelectAddressContext, SudokuDataContext } from '@/base/context';
import { ClassNamesArg, cx } from "@emotion/css";
import { useContext } from "react";


export interface SudokuButtonProps {
  className?: ClassNamesArg;
  cellNumber: number;
}

const SudokuButton = ({
  className = '',
  cellNumber,
}: SudokuButtonProps) => {

  const { dispatchData } = useContext(SudokuDataContext);

  const { selectedAddress } = useContext(SelectAddressContext);

  const handleInput = (value: number) => {
    dispatchData({ address: selectedAddress, cellNumber: value });
  };

  return (
    <div className={cx("sudoku-cell", className)}>
      <button className="sudoku-cell-inner"
        onClick={() => handleInput(cellNumber)}
      >
        {cellNumber}
      </button>
    </div>
  );
};

export default SudokuButton;
