export const POINT_TYPE = [
  "row_col", "row_num", "col_num", "box_num"
] as const;

export type PointType = typeof POINT_TYPE[number];

export const isPointType = (key: string) =>
  POINT_TYPE.includes(key as PointType);
