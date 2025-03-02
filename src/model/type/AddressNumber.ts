export const ADDRESS_NUMBER = [...[...Array(81)].map((_, i) => i)] as const;

export type AddressNumberType = (typeof ADDRESS_NUMBER)[number];

export const isAddressNumber = (param: number) =>
  ADDRESS_NUMBER.indexOf(param as AddressNumberType) >= 0;
