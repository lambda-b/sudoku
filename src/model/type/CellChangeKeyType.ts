import { ONE_DIGIT_NUMBERS } from "@/model/type/OneDigitNumberType";

export const CELL_CHANGE_KEYS = [
  ...ONE_DIGIT_NUMBERS, "Backspace"
] as const;

export type CellChangeKeyType = typeof CELL_CHANGE_KEYS[number];

export const isCellChangeKeyType = (param: string) => CELL_CHANGE_KEYS.includes(param as CellChangeKeyType);
