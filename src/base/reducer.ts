
export const INITIAL_SUDOKU_DATA =
  "081070250000040000290805073025000480700908006008000900800401002060000010000506000";

export type SudokuDataAction = {
  address: number,
  cellNumber: number,
};

export const sudokuDataFunction = (data: string, action: SudokuDataAction) => {
  if (action.address < 0 || action.address > 80) {
    return data;
  }
  if (action.cellNumber < 0 || action.cellNumber > 9) {
    return data;
  }

  return data.split("")
    .map((ch, address) => {
      return address === action.address ? String(action.cellNumber) : ch;
    }).join("");
};
