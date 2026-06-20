import { atom } from "jotai";

export type SolveStatus =
  | "idle"
  | "solving"
  | "solved"
  | "invalid"
  | "no-solution"
  | "multiple-solutions"
  | "stopped";

export const solveStatusState = atom<SolveStatus>("idle");
export const conflictAddressesState = atom<number[]>([]);
