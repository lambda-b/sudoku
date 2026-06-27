import { SudokuPuzzleLoader } from "@/components/block/SudokuPuzzleLoader";
import { SudokuResetButton } from "@/components/block/SudokuResetButton";
import SudokuSelectSheet from "@/components/block/SudokuSelectSheet";
import { SudokuSolveButton } from "@/components/block/SudokuSolveButton";
import { SudokuSolveStatus } from "@/components/block/SudokuSolveStatus";
import SudokuTable from "@/components/block/SudokuTable";

const Sudoku = () => {
  return (
    <div className="mx-auto w-[min(630px,calc(100vw-16px))] text-center [--sudoku-scale:min(1,calc((100vw-16px)/630px))]">
      <div className="w-[630px] origin-top-left [zoom:var(--sudoku-scale)]">
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
    </div>
  );
};

export default Sudoku;
