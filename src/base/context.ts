import { createContext, Dispatch } from "react";
import {
  INITIAL_SUDOKU_DATA,
  SelectAddressAction,
  SudokuDataAction
} from "@/base/reducer";

interface SudokuContextType {
  data: string;
  dispatchData: Dispatch<SudokuDataAction>;
}

const SUDOKU_CONTEXT_DEFAULT: SudokuContextType = {
  data: INITIAL_SUDOKU_DATA,
  dispatchData: () => { },
};

export const SudokuDataContext = createContext(SUDOKU_CONTEXT_DEFAULT);

interface SelectAddressContextType {
  selectedAddress: number;
  dispatchAddress: Dispatch<SelectAddressAction>;
}

const SELECT_ADDRESS_CONTEXT_DEFAULT: SelectAddressContextType = {
  selectedAddress: -1,
  dispatchAddress: () => { },
};

export const SelectAddressContext = createContext(
  SELECT_ADDRESS_CONTEXT_DEFAULT,
);
