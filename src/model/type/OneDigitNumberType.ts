export const ONE_DIGIT_NUMBERS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
] as const;

export type OneDigitNumberType = (typeof ONE_DIGIT_NUMBERS)[number];

export const isOneDigitNumberType = (param: string) =>
  ONE_DIGIT_NUMBERS.indexOf(param as OneDigitNumberType) >= 0;
