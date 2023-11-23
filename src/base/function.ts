import { SolutionNumberType } from "@/model/type/SolutionNumberType";

export const convert = (data: string) => {
  type UnsolvedType = SolutionNumberType | 0;
  if (data.length !== 81) {
    return [] as UnsolvedType[][];
  }

  const data2D: UnsolvedType[][] = [];
  for (let i = 0; i < 9; i++) {
    const subdata = data
      .substring(9 * i, 9 * (i + 1))
      .split("")
      .map(ch => Number(ch));
    data2D.push(subdata as UnsolvedType[]);
  }

  return data2D;
};

export const toString = (data2D: (SolutionNumberType | 0)[][]) => {
  return data2D.map(row => row.join("")).join("");
};
