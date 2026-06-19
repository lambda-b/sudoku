export const COL_TYPE = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;

export type ColType = (typeof COL_TYPE)[number];

export const isColType = (param: number) =>
  COL_TYPE.indexOf(param as ColType) >= 0;
