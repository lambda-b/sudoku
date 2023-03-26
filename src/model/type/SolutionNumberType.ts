export const SOLUTION_NUMBERS = [...[...Array(10)].map((_, index) => index)] as const;

export type SolutionNumberType = typeof SOLUTION_NUMBERS[number];

export const isSolutionNumberType = (param: number) => SOLUTION_NUMBERS.includes(param as SolutionNumberType);
