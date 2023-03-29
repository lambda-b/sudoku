import { ClassNamesArg, cx } from '@emotion/css';
import React, { useContext } from 'react';
import { SelectAddressContext, SudokuDataContext } from '@/base/context';

export interface SudokuCellProps {
  className?: ClassNamesArg;
  cellNumber: number;
  address: number;
}

/**
 * セル一個を表示するためのコンポーネント
 * 
 * @param className CSSクラス
 * @param cellNumber cellの番号
 * @param address セルの位置
 */
const SudokuCell = ({
  className = '',
  cellNumber,
  address,
}: SudokuCellProps) => {

  const { dispatchData } = useContext(SudokuDataContext);

  const { selectedAddress, dispatchAddress } = useContext(SelectAddressContext);

  const isSelected = address === selectedAddress;

  return (
    <div className={cx("sudoku-cell", className)}>
      <div
        className={cx("sudoku-cell-inner", isSelected && 'cell-selected')}
        onClick={() => dispatchAddress({ type: 'click', address })}
        onDoubleClick={() => dispatchData({ address, cellNumber: 0 })}
      >
        {!!cellNumber && cellNumber}
      </div>
    </div>
  )
}

export default SudokuCell;
