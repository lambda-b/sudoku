import { cellState } from "@/base/jotai/cell";
import { cx } from "@emotion/css";
import { useAtom } from "jotai";

export interface SudokuCellProps {
  className?: string;
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
  address,
}: SudokuCellProps) => {

  const [cell, setCell] = useAtom(cellState(address));

  const { cellNumber, isSelected } = cell;

  return (
    <div className={cx("sudoku-cell", className)}>
      <div
        className={cx("sudoku-cell-inner", isSelected && "cell-selected")}
        onClick={() => setCell({ cellNumber, address, isSelected: true })}
        onDoubleClick={() => setCell({ ...cell, cellNumber: 0 })}
      >
        {!!cellNumber && cellNumber}
      </div>
    </div>
  );
};

export default SudokuCell;
