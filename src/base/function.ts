import { Dispatch } from "react"
import { SelectAddressAction, SudokuDataAction } from "@/base/reducer"
import { AddressMoveKeyType, isAddressMoveKeyType } from "@/model/type/AddressMoveKeyType";
import { isOneDigitNumberType } from "@/model/type/OneDigitNumberType";
import { SolutionNumberType } from "@/model/type/SolutionNumberType";

export const handleKeyDown = (
  event: KeyboardEvent,
  address: number,
  dispatchAddress: Dispatch<SelectAddressAction>,
  dispatchData: Dispatch<SudokuDataAction>,
) => {
  if (address < 0 || address >= 81) {
    return;
  }

  if (isAddressMoveKeyType(event.key)) {
    dispatchAddress({ type: event.key as AddressMoveKeyType });
    return;
  }

  if (event.key === 'Backspace') {
    dispatchData({ address, cellNumber: 0 });
    return;
  }

  if (isOneDigitNumberType(event.key)) {
    dispatchData({ address, cellNumber: Number(event.key) });
    return;
  }
};

export const convert = (data: string) => {
  type UnsolvedType = SolutionNumberType | 0;
  if (data.length !== 81) {
    return [] as UnsolvedType[][];
  }

  const data2D: UnsolvedType[][] = [];
  for (let i = 0; i < 9; i++) {
    const subdata = data
      .substring(9 * i, 9 * (i + 1))
      .split("")
      .map(ch => Number(ch));
    data2D.push(subdata as UnsolvedType[]);
  }

  return data2D;
};

export const toString = (data2D: (SolutionNumberType | 0)[][]) => {
  return data2D.map(row => row.join("")).join("");
};
