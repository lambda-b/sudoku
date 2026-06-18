import SudokuSelectSheet from "@/components/block/SudokuSelectSheet";
import { SudokuSolveButton } from "@/components/block/SudokuSolveButton";
import SudokuTable from "@/components/block/SudokuTable";

function Sudoku() {
  return (
    <div className="min-w-[630px] text-center">
      <SudokuSolveButton />
      <SudokuTable />
      <SudokuSelectSheet />
    </div>
  );
}

export default Sudoku;
