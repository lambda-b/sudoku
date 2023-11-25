import { addressState, cellState } from "@/base/recoil";
import { AddressMoveKeyType, isAddressMoveKeyType } from "@/model/type/AddressMoveKeyType";
import { AddressNumberType, isAddressNumber } from "@/model/type/AddressNumber";
import { isOneDigitNumberType } from "@/model/type/OneDigitNumberType";
import { CallbackInterface } from "recoil";

const selectAddressFunction = (
  address: AddressNumberType | -1,
  type: AddressMoveKeyType,
) => {
  if (!isAddressNumber(address)) {
    return address;
  }
  switch (type) {
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

export const handleRecoilByKey = (
  { snapshot, set }: CallbackInterface,
  event: KeyboardEvent,
) => {

  const { getLoadable } = snapshot;
  const address = getLoadable(addressState).contents;
  if (!isAddressNumber(address)) {
    return;
  }

  if (isAddressMoveKeyType(event.key)) {
    const type = event.key as AddressMoveKeyType;
    const newAddress = selectAddressFunction(address, type);
    set(addressState, newAddress);
    return;
  }

  const cell = getLoadable(cellState(address)).contents;
  if (event.key === 'Backspace') {
    set(cellState(address), { ...cell, cellNumber: 0 });
    return;
  }

  if (isOneDigitNumberType(event.key)) {
    const cellNumber = Number(event.key);
    set(cellState(address), { ...cell, cellNumber });
    return;
  }
};
