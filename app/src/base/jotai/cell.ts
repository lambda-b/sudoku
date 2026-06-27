import { atom } from "jotai";
import { atomFamily } from "jotai-family";
import { addressAtom } from "@/base/jotai/address";
import { solveStatusState } from "@/base/jotai/solver";
import type { SudokuCellModel } from "@/model/SudokuCellModel";
import {
  ADDRESS_NUMBER,
  type AddressNumberType,
} from "@/model/type/AddressNumber";

export const INITIAL_SUDOKU_DATA =
  "081070250000040000290805073025000480700908006008000900800401002060000010000506000";

export const puzzleState = atom(INITIAL_SUDOKU_DATA);

export const cellAtom = atomFamily((address: AddressNumberType) =>
  atom<SudokuCellModel>({
    cellNumber: Number(INITIAL_SUDOKU_DATA[address]),
    address,
    isSelected: false,
    status: "default",
  }),
);

export const cellState = atomFamily((address: AddressNumberType) =>
  atom(
    (get) => get(cellAtom(address)),
    (get, set, cell: SudokuCellModel) => {
      const oldAddress = get(addressAtom);
      const oldCell = get(cellAtom(oldAddress));
      set(cellAtom(oldAddress), { ...oldCell, isSelected: false });

      set(addressAtom, cell.address);
      set(cellAtom(address), cell);
      if (oldCell.cellNumber !== cell.cellNumber) {
        set(solveStatusState, "idle");
        for (const cellAddress of ADDRESS_NUMBER) {
          const tableCell = get(cellAtom(cellAddress));
          set(cellAtom(cellAddress), { ...tableCell, status: "default" });
        }
      }
    },
  ),
);

export const cellStatusUpdater = atom(null, (get, set, conflicts: number[]) => {
  const conflictSet = new Set(conflicts);
  for (const address of ADDRESS_NUMBER) {
    const cell = get(cellAtom(address));
    set(cellAtom(address), {
      ...cell,
      status: conflictSet.has(address) ? "conflict" : "default",
    });
  }
});

export const cellNumberState = atom(
  (get) => {
    const address = get(addressAtom);
    const cell = get(cellAtom(address));
    return cell.cellNumber;
  },
  (get, set, cellNumber: number) => {
    if (get(solveStatusState) === "solving") {
      return;
    }
    const address = get(addressAtom);
    if (get(puzzleState)[address] !== "0") {
      return;
    }
    const cell = get(cellAtom(address));
    set(cellAtom(address), { ...cell, cellNumber });
    set(solveStatusState, "idle");
    for (const cellAddress of ADDRESS_NUMBER) {
      const tableCell = get(cellAtom(cellAddress));
      set(cellAtom(cellAddress), { ...tableCell, status: "default" });
    }
  },
);

export const tableState = atom(
  (get) =>
    ADDRESS_NUMBER.map((address) => {
      const cell = get(cellAtom(address));
      return cell.cellNumber;
    }).join(""),
  (get, set, table: string) => {
    if (table.length !== ADDRESS_NUMBER.length) {
      return;
    }

    table.split("").forEach((value, i) => {
      const cell = get(cellAtom(i));
      set(cellAtom(i), {
        ...cell,
        cellNumber: Number(value),
        status: "default",
      });
    });
  },
);
