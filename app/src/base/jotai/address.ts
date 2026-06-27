import type { AddressNumberType } from "@sudoku/core/model/type/AddressNumber";
import { atom } from "jotai";

export const addressAtom = atom<AddressNumberType | -1>(-1);
