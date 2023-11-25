import { INITIAL_SUDOKU_DATA } from "@/base/reducer";
import { ADDRESS_NUMBER, AddressNumberType } from "@/model/type/AddressNumber";
import { DefaultValue, atom, atomFamily, selector, selectorFamily } from "recoil";

export interface Cell {
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

export const cellWholeState = selector<Cell | undefined>({
  key: "cell-whole-selector",
  get: () => undefined,
  set: ({ set }, cell) => {
    if (!cell) {
      return;
    }

    if (cell instanceof DefaultValue) {
      return;
    }

    set(cellState(cell.address), cell);
  }
})

export const tableState = selector<string>({
  key: "table-selector",
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
