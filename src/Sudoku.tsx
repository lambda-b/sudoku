import React, { useReducer } from 'react';
import SudokuSelectSheet from './components/block/SudokuSelectSheet';
import SudokuTable from './components/block/SudokuTable';
import { SelectAddressContext, SudokuDataContext } from './foundation/context';
import { INITIAL_SUDOKU_DATA, selectAddressFunction, sudokuDataFunction } from './foundation/reducer';

function Sudoku() {

  const [selectedAddress, dispatchAddress] = useReducer(selectAddressFunction, -1);

  const [data, dispatchData] = useReducer(sudokuDataFunction, INITIAL_SUDOKU_DATA);

  return (
    <div className="container">
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
