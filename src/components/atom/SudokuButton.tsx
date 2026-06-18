import { useSetAtom } from "jotai";
import { cx } from "@/base/function";
import { cellNumberState } from "@/base/jotai/cell";

export interface SudokuButtonProps {
  className?: string;
  cellNumber: number;
}

const SudokuButton = ({ className = "", cellNumber }: SudokuButtonProps) => {
  const setCell = useSetAtom(cellNumberState);

  const handleInput = () => {
    setCell(cellNumber);
  };

  return (
    <div className={cx("h-[70px] w-[70px] border-[#b5b5b5]", className)}>
      <button
        className="h-full w-full cursor-pointer text-center text-[40px]"
        onClick={handleInput}
        type="button"
      >
        {cellNumber}
      </button>
    </div>
  );
};

export default SudokuButton;
