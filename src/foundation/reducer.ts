import { AddressMoveKeyType } from "@/model/type/AddressMoveKeyType";

type SelectActionKeyBoard = {
  type: AddressMoveKeyType,
};

type SelectActionClick = {
  type: "click",
  address: number,
};

export type SelectAddressAction = SelectActionKeyBoard | SelectActionClick;

export const selectAddressFunction = (
  address: number,
  action: SelectAddressAction
) => {
  if (action.type === "click") {
    return action.address;
  }
  if (address < 0 || address > 80) {
    return address;
  }
  switch (action.type) {
    case "ArrowUp":
      return address < 9 ? address : address - 9;
    case "ArrowDown":
      return address + 9 > 80 ? address : address + 9;
    case "ArrowLeft":
      return address % 9 === 0 ? address : address - 1;
    case "ArrowRight":
      return address % 9 === 8 ? address : address + 1;
    case "Escape":
      return -1;
    default:
      return address;
  }
};

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
