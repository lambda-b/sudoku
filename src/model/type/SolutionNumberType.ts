export const SOLUTION_NUMBERS = [
  ...[...Array(9)].map((_, index) => index + 1),
] as const;

export type SolutionNumberType = (typeof SOLUTION_NUMBERS)[number];

export const isSolutionNumberType = (param: number) =>
  SOLUTION_NUMBERS.indexOf(param as SolutionNumberType) >= 0;
