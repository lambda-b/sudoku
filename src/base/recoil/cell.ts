import { addressAtom } from "@/base/recoil/address";
import { ADDRESS_NUMBER, AddressNumberType } from "@/model/type/AddressNumber";
import { DefaultValue, atomFamily, selector, selectorFamily } from "recoil";


export const INITIAL_SUDOKU_DATA =
  "081070250000040000290805073025000480700908006008000900800401002060000010000506000";

export interface Cell {
  cellNumber: number,
  address: AddressNumberType,
  isSelected: boolean,
}

export const cellAtom = atomFamily<Cell, AddressNumberType>({
  key: "cell-atom",
  default: address => {
    return {
      cellNumber: Number(INITIAL_SUDOKU_DATA[address]),
      address,
      isSelected: false,
    };
  },
});

export const cellState = selectorFamily<Cell, AddressNumberType>({
  key: "cell",
  get: address => ({ get }) => get(cellAtom(address)),
  set: address => ({ get, set }, cell) => {
    const oldAddress = get(addressAtom);
    const oldCell = get(cellAtom(oldAddress));
    set(cellAtom(oldAddress), { ...oldCell, isSelected: false });

    const newAddress = cell instanceof DefaultValue ? -1 : cell.address;
    set(addressAtom, newAddress);
    set(cellAtom(address), cell);
  },
});

export const cellNumberState = selector<number>({
  key: "cell-number",
  get: ({ get }) => {
    const address = get(addressAtom);
    const cell = get(cellAtom(address));
    return cell.cellNumber;
  },
  set: ({ get, set }, cellNumber) => {
    if (cellNumber instanceof DefaultValue) {
      return;
    }
    const address = get(addressAtom);
    const cell = get(cellAtom(address));
    set(cellAtom(address), { ...cell, cellNumber });
  },
});

export const tableState = selector<string>({
  key: "table",
  get: ({ get }) => {
    return ADDRESS_NUMBER.map(address => {
      const cell = get(cellAtom(address));
      return cell.cellNumber;
    }).join("");
  },
  set: ({ get, set }, table) => {
    if (table instanceof DefaultValue) {
      set(tableState, INITIAL_SUDOKU_DATA)
      return;
    }

    if (table.length !== ADDRESS_NUMBER.length) {
      return;
    }

    table.split("").map((value, i) => {
      const cell = get(cellAtom(i));
      set(cellAtom(i), { ...cell, cellNumber: Number(value) });
    });
  },
});
