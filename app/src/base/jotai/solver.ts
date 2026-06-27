import { atom } from "jotai";
import type { SolveStatus } from "@/services/type";

export const solveStatusState = atom<SolveStatus>("idle");
