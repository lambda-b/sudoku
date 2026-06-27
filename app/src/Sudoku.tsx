import { SudokuPuzzleLoader } from "@/components/block/SudokuPuzzleLoader";
import { SudokuResetButton } from "@/components/block/SudokuResetButton";
import SudokuSelectSheet from "@/components/block/SudokuSelectSheet";
import { SudokuSolveButton } from "@/components/block/SudokuSolveButton";
import { SudokuSolveStatus } from "@/components/block/SudokuSolveStatus";
import SudokuTable from "@/components/block/SudokuTable";

const Sudoku = () => {
  return (
    <div className="min-w-[630px] text-center">
      <div className="mx-auto my-3 flex w-[630px] items-center justify-between">
        <div className="flex items-center gap-3">
          <SudokuPuzzleLoader />
          <SudokuResetButton />
          <SudokuSolveButton />
        </div>
        <SudokuSolveStatus />
      </div>
      <SudokuTable />
      <SudokuSelectSheet />
    </div>
  );
};

export default Sudoku;
