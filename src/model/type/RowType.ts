export const ROW_TYPE = [...[...Array(9)].map((_, index) => index)] as const;

export type RowType = typeof ROW_TYPE[number];

export const isRowType = (param: number) => ROW_TYPE.includes(param as RowType);
