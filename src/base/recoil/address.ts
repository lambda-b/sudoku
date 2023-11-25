import { cellAtom } from "@/base/recoil/cell";
import { AddressNumberType } from "@/model/type/AddressNumber";
import { DefaultValue, atom, selector } from "recoil";

export const addressAtom = atom<AddressNumberType | -1>({
  key: "address-atom",
  default: -1,
});

export const addressState = selector<AddressNumberType | -1>({
  key: "address",
  get: ({ get }) => get(addressAtom),
  set: ({ get, set }, address) => {
    const oldAddress = get(addressAtom);
    const oldCell = get(cellAtom(oldAddress));
    set(cellAtom(oldAddress), { ...oldCell, isSelected: false });

    const newAddress = address instanceof DefaultValue ? -1 : address;
    const newCell = get(cellAtom(newAddress));
    set(cellAtom(newAddress), { ...newCell, isSelected: true });
    set(addressAtom, newAddress);
  },
});
