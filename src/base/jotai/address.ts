import { atom } from "jotai";
import { cellAtom } from "@/base/jotai/cell";
import type { AddressNumberType } from "@/model/type/AddressNumber";

export const addressAtom = atom<AddressNumberType | -1>(-1);

export const addressState = atom(
  (get) => get(addressAtom),
  (get, set, address: AddressNumberType | -1) => {
    const oldAddress = get(addressAtom);
    const oldCell = get(cellAtom(oldAddress));
    set(cellAtom(oldAddress), { ...oldCell, isSelected: false });

    const newCell = get(cellAtom(address));
    set(cellAtom(address), { ...newCell, isSelected: true });
    set(addressAtom, address);
  },
);
