import { clsx } from "clsx";
import { memo } from "react";
import type { SolveStatus } from "@/services/solver/type";

export interface SudokuButtonProps {
  className?: string;
  cellNumber: number;
  onCellNumberSelect: (cellNumber: number) => void;
  solveStatus: SolveStatus;
}

const SudokuButton = ({
  className = "",
  cellNumber,
  onCellNumberSelect,
  solveStatus,
}: SudokuButtonProps) => {
  return (
    <div className={clsx("h-[70px] w-[70px] border-[#b5b5b5]", className)}>
      <button
        className="h-full w-full cursor-pointer text-center text-[40px] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={solveStatus === "solving"}
        onClick={() => onCellNumberSelect(cellNumber)}
        type="button"
      >
        {cellNumber}
      </button>
    </div>
  );
};

export default memo(SudokuButton);
