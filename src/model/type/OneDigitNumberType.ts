export const ONE_DIGIT_NUMBERS = [...[...Array(10)].map((_, index) => String(index))] as const;

export type OneDigitNumberType = typeof ONE_DIGIT_NUMBERS[number];

export const isOneDigitNumberType = (param: string) => ONE_DIGIT_NUMBERS.includes(param as OneDigitNumberType);
