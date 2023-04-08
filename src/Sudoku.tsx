import SudokuSolver from '@/calc/SudokuSolver';
import { useReducer, useState } from 'react';
import { SelectAddressContext, SudokuDataContext } from './base/context';
import { INITIAL_SUDOKU_DATA, selectAddressFunction, sudokuDataFunction } from './base/reducer';
import SudokuSelectSheet from './components/block/SudokuSelectSheet';
import SudokuTable from './components/block/SudokuTable';

function Sudoku() {

  const [selectedAddress, dispatchAddress] = useReducer(selectAddressFunction, -1);

  const [data, dispatchData] = useReducer(sudokuDataFunction, INITIAL_SUDOKU_DATA);

  const [solver] = useState<SudokuSolver>(new SudokuSolver(dispatchData));

  const onClickSolve = () => {
    const itr = solver.solve(data);

    const exe = setInterval(() => {
      if (itr.next().done) {
        clearInterval(exe);
      }
    }, 100);
  }

  return (
    <div className="container">
      <button
        className="button"
        onClick={onClickSolve}
      >Solve</button>
      <SudokuDataContext.Provider value={{ data, dispatchData }}>
        <SelectAddressContext.Provider value={{ selectedAddress, dispatchAddress }}>
          <SudokuTable />
          <SudokuSelectSheet />
        </SelectAddressContext.Provider>
      </SudokuDataContext.Provider>
    </div>
  );
}

export default Sudoku;
