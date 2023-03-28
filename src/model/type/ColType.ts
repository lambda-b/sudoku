export const COL_TYPE = [...Array(9).map((_, index) => index)] as const;

export type ColType = typeof COL_TYPE[number];

export const isColType = (param: number) => COL_TYPE.includes(param as ColType);
