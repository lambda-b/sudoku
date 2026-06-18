import { SudokuPuzzleLoader } from "@/components/block/SudokuPuzzleLoader";
import SudokuSelectSheet from "@/components/block/SudokuSelectSheet";
import { SudokuSolveButton } from "@/components/block/SudokuSolveButton";
import SudokuTable from "@/components/block/SudokuTable";

const Sudoku = () => {
  return (
    <div className="min-w-[630px] text-center">
      <div className="my-3 flex items-center justify-center gap-3">
        <SudokuPuzzleLoader />
        <SudokuSolveButton />
      </div>
      <SudokuTable />
      <SudokuSelectSheet />
    </div>
  );
};

export default Sudoku;
