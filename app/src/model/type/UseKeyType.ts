import { ADDRESS_MOVE_KEYS } from "@/model/type/AddressMoveKeyType";
import { CELL_CHANGE_KEYS } from "@/model/type/CellChangeKeyType";

export const USE_KEYS = [...ADDRESS_MOVE_KEYS, CELL_CHANGE_KEYS] as const;

export type UseKeyType = (typeof USE_KEYS)[number];

export const isUseKeyType = (param: string) =>
  USE_KEYS.indexOf(param as UseKeyType) >= 0;
