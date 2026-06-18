export const ADDRESS_NUMBER = Array.from({ length: 81 }, (_, i) => i);

export type AddressNumberType = (typeof ADDRESS_NUMBER)[number];

export const isAddressNumber = (param: number) =>
  ADDRESS_NUMBER.indexOf(param as AddressNumberType) >= 0;
