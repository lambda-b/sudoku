export const ROW_TYPE = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;

export type RowType = (typeof ROW_TYPE)[number];

export const isRowType = (param: number) =>
  ROW_TYPE.indexOf(param as RowType) >= 0;
