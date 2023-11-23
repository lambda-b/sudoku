import { INITIAL_SUDOKU_DATA } from "@/base/reducer";
import { ADDRESS_NUMBER, AddressNumberType } from "@/model/type/AddressNumber";
import { DefaultValue, atom, atomFamily, selector, selectorFamily } from "recoil";

interface Cell {
  cellNumber: number;
  address: AddressNumberType,
  isSelected: boolean;
}

const cellAtom = atomFamily<Cell, AddressNumberType>({
  key: "cell",
  default: address => {
    return {
      cellNumber: 0,
      address,
      isSelected: false,
    };
  },
});

export const cellState = selectorFamily<Cell, AddressNumberType>({
  key: "cell-selector",
  get: address => ({ get }) => get(cellAtom(address)),
  set: address => ({ get, set }, newValue) => {
    const oldAddress = get(addressAtom);
    const oldCell = get(cellAtom(oldAddress));
    set(cellAtom(oldAddress), { ...oldCell, isSelected: false });

    const newAddress = newValue instanceof DefaultValue ? -1 : newValue.address;
    set(addressAtom, newAddress);
    set(cellAtom(address), newValue);
  },
});

export const tableState = selector<string>({
  key: "table-selector",
  get: ({ get }) => {
    return ADDRESS_NUMBER.map(address => get(cellAtom(address))).join("");
  },
  set: ({ get, set }, table) => {
    if (table instanceof DefaultValue) {
      set(tableState, INITIAL_SUDOKU_DATA);
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

const addressAtom = atom<AddressNumberType | -1>({
  key: "address",
  default: -1,
});

export const addressState = selector<AddressNumberType | -1>({
  key: "address-selector",
  get: ({ get }) => get(addressAtom),
  set: ({ get, set }, newAddress) => {
    const oldAddress = get(addressAtom);
    const oldCell = get(cellAtom(oldAddress));
    set(cellAtom(oldAddress), { ...oldCell, isSelected: false });

    const address = newAddress instanceof DefaultValue ? -1 : newAddress;
    const newCell = get(cellAtom(address));
    set(cellAtom(address), { ...newCell, isSelected: true });
    set(addressAtom, address);
  },
});
