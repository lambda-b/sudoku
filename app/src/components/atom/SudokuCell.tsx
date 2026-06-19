import { useAtom } from "jotai";
import { cx } from "@/base/function";
import { cellState } from "@/base/jotai/cell";

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
const SudokuCell = ({ className = "", address }: SudokuCellProps) => {
  const [cell, setCell] = useAtom(cellState(address));

  const { cellNumber, isSelected } = cell;

  return (
    <div className={cx("h-[70px] w-[70px] border-[#b5b5b5]", className)}>
      <button
        type="button"
        className={cx(
          "h-full w-full cursor-pointer appearance-none bg-transparent p-0 text-center text-[40px] leading-[70px]",
          isSelected && "shadow-[0_0_10px_hsl(207_61%_53%)]",
        )}
        onClick={() => setCell({ cellNumber, address, isSelected: true })}
        onDoubleClick={() => setCell({ ...cell, cellNumber: 0 })}
      >
        {!!cellNumber && cellNumber}
      </button>
    </div>
  );
};

export default SudokuCell;
