export const SOLUTION_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export type SolutionNumberType = (typeof SOLUTION_NUMBERS)[number];

export const isSolutionNumberType = (param: number) =>
  SOLUTION_NUMBERS.indexOf(param as SolutionNumberType) >= 0;
