export const BOX_TYPE = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;

export type BoxType = (typeof BOX_TYPE)[number];

export const isBoxType = (param: number) =>
  BOX_TYPE.indexOf(param as BoxType) >= 0;
