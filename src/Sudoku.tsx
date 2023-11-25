import { SudokuSolveButton } from '@/components/block/SudokuSolveButton';
import SudokuSelectSheet from './components/block/SudokuSelectSheet';
import SudokuTable from './components/block/SudokuTable';

function Sudoku() {

  return (
    <div className="container">
      <SudokuSolveButton />
      <SudokuTable />
      <SudokuSelectSheet />
    </div>
  );
}

export default Sudoku;
