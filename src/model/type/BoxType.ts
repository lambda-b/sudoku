export const BOX_TYPE = [...[...Array(9)].map((_, index) => index)] as const;

export type BoxType = typeof BOX_TYPE[number];

export const isBoxType = (param: number) => BOX_TYPE.includes(param as BoxType);
