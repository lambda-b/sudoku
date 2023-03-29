import { convert } from "@/base/function";
import { SudokuDataAction } from "@/base/reducer";
import { GridBoxNumKey } from "@/model/GridBoxNumKey";
import { GridColNumKey } from "@/model/GridColNumKey";
import { GridKey } from "@/model/GridKey";
import { GridOption } from "@/model/GridOption";
import { GridRowColKey } from "@/model/GridRowColKey";
import { GridRowNumKey } from "@/model/GridRowNumKey";
import { BoxType } from "@/model/type/BoxType";
import { ColType, COL_TYPE, isColType } from "@/model/type/ColType";
import { isRowType, RowType, ROW_TYPE } from "@/model/type/RowType";
import { isSolutionNumberType, SolutionNumberType, SOLUTION_NUMBERS } from "@/model/type/SolutionNumberType";
import { IdMap } from "@/utility/IdMap";
import { Dispatch } from "react";

/**
 * exact-cover問題の横軸(key)を作成
 * 
 * @param option 
 * @returns 
 */
const createKeyList = (option: GridOption) => {
  const { row, col, num } = option;
  const rc = new GridRowColKey(row, col);
  const rn = new GridRowNumKey(row, num);
  const cn = new GridColNumKey(col, num);
  const b = 3;
  const box = Math.floor(row / b) * b + Math.floor(col / b);
  const bn = new GridBoxNumKey(box as BoxType, num);
  return [rc, rn, cn, bn];
};

/**
 * row, col, num のすべての組合せを導出
 * 
 * @returns 
 */
const createAllGridOption = () => {
  const allOptions: GridOption[] = [];

  for (const row of ROW_TYPE) {
    for (const col of COL_TYPE) {
      for (const num of SOLUTION_NUMBERS) {
        const option = new GridOption(row, col, num);
        allOptions.push(option);
      }
    }
  }

  return allOptions;
};

const exactCover = (allOptions: GridOption[]) => {
  const feasibles = new IdMap<GridKey, GridOption[]>();
  for (const option of allOptions) {
    const keyList = createKeyList(option);
    for (const key of keyList) {
      const equivalences = feasibles.get(key);
      if (equivalences) {
        equivalences.push(option);
      } else {
        feasibles.set(key, [option]);
      }
    }
  }

  return feasibles;
};

const select = (
  feasibles: Map<GridKey, GridOption[]>,
  leadingOption: GridOption,
) => {
  const equivalencesList: GridOption[][] = [];
  for (const key1 of createKeyList(leadingOption)) {
    const equivalences = feasibles.get(key1) ?? [];
    for (const neighbor of equivalences) {
      const neighborKeys = createKeyList(neighbor);
      for (const key2 of neighborKeys) {
        if (!key1.equals(key2)) {
          const options = (feasibles.get(key2) ?? []).filter(
            (option) => !option.equals(neighbor)
          );
          feasibles.set(key2, options);
        }
      }
    }
    equivalencesList.push(equivalences);
    feasibles.delete(key1);
  }

  return equivalencesList;
};

const deselect = (
  feasibles: Map<GridKey, GridOption[]>,
  leadingOption: GridOption,
  equivalencesList: GridOption[][],
) => {
  const keyList = createKeyList(leadingOption);
  for (const key1 of keyList.reverse()) {
    const equivalences = equivalencesList.pop();
    if (equivalences) {
      feasibles.set(key1, equivalences);
      for (const option of equivalences) {
        for (const key2 of createKeyList(option)) {
          if (!key1.equals(key2)) {
            const options = feasibles.get(key2) ?? [];
            options.push(option);
            feasibles.set(key2, options);
          }
        }
      }
    }
  }
};

const preSelectGridOption = (
  grid: (SolutionNumberType | 0)[][],
  feasibles: Map<GridKey, GridOption[]>,
) => {
  grid.forEach((row, i) => {
    row.forEach((num, j) => {
      if (isSolutionNumberType(num) && isRowType(i) && isColType(j)) {
        const option = new GridOption(
          i as RowType,
          j as ColType,
          num as SolutionNumberType,
        );
        select(feasibles, option);
      }
    });
  });
};

const solve = function* (
  feasibles: Map<GridKey, GridOption[]>,
  solution: GridOption[]
): IterableIterator<GridOption[]> {
  if (feasibles.size === 0) {
    yield solution;
  } else {
    const values = Array.from(feasibles.values());
    const minOptions = values.reduce((accumulator, current) =>
      accumulator.length < current.length ? accumulator : current
    );
    for (const option of minOptions) {
      solution.push(option);
      const equivalencesList = select(feasibles, option);
      for (const iterSolution of solve(feasibles, solution)) {
        yield iterSolution;
      }
      deselect(feasibles, option, equivalencesList);
      solution.pop();
    }
  }
};

export const solveSudoku = function* (
  data: string,
  dispatch: Dispatch<SudokuDataAction>,
) {
  const grid = convert(data);
  const allOptions = createAllGridOption();
  const feasibles = exactCover(allOptions);

  preSelectGridOption(grid, feasibles);

  for (const solution of solve(feasibles, [])) {
    for (const option of solution) {
      const { row, col, num } = option;
      const address = row * 9 + col;
      const cellNumber = num;
      dispatch({ address, cellNumber });
      yield;
    }
  }
};
