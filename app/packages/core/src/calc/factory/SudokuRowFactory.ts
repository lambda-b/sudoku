import { LinkNode } from "@sudoku/core/algorithm/dancinglinks/LinkNode";
import type { ColumnAdapter } from "@sudoku/core/calc/adapter/ColumnAdapter";
import { RowAdapter } from "@sudoku/core/calc/adapter/RowAdapter";
import { GridBoxNumKey } from "@sudoku/core/model/GridBoxNumKey";
import { GridColNumKey } from "@sudoku/core/model/GridColNumKey";
import type { GridKey } from "@sudoku/core/model/GridKey";
import { GridOption } from "@sudoku/core/model/GridOption";
import { GridRowColKey } from "@sudoku/core/model/GridRowColKey";
import { GridRowNumKey } from "@sudoku/core/model/GridRowNumKey";
import type { BoxType } from "@sudoku/core/model/type/BoxType";
import { COL_TYPE } from "@sudoku/core/model/type/ColType";
import { ROW_TYPE } from "@sudoku/core/model/type/RowType";
import { SOLUTION_NUMBERS } from "@sudoku/core/model/type/SolutionNumberType";

export const createAllRows = (allColumns: Map<GridKey, ColumnAdapter>) => {
  const covers: RowAdapter[] = [];

  for (const row of ROW_TYPE) {
    for (const col of COL_TYPE) {
      for (const num of SOLUTION_NUMBERS) {
        const option = new GridOption(row, col, num);
        const algRow = createRow(allColumns, option);
        covers.push(algRow);
      }
    }
  }

  return covers;
};

const createRow = (
  allColumns: Map<GridKey, ColumnAdapter>,
  option: GridOption,
) => {
  const row = new RowAdapter(option);

  const key1 = new GridRowColKey(option.row, option.col);
  const column1 = allColumns.get(key1);
  if (!column1) {
    throw Error("undefined");
  }
  LinkNode.create(row, column1);

  const key2 = new GridRowNumKey(option.row, option.num);
  const column2 = allColumns.get(key2);
  if (!column2) {
    throw Error("undefined");
  }
  LinkNode.create(row, column2);

  const key3 = new GridColNumKey(option.col, option.num);
  const column3 = allColumns.get(key3);
  if (!column3) {
    throw Error("undefined");
  }
  LinkNode.create(row, column3);

  const b = 3;
  const box = (Math.floor(option.row / b) * b +
    Math.floor(option.col / b)) as BoxType;
  const key4 = new GridBoxNumKey(box, option.num);
  const column4 = allColumns.get(key4);
  if (!column4) {
    throw Error("undefined");
  }
  LinkNode.create(row, column4);

  return row;
};
