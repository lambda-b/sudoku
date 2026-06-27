import { ColumnAdapter } from "@sudoku/core/calc/adapter/ColumnAdapter";
import { GridBoxNumKey } from "@sudoku/core/model/GridBoxNumKey";
import { GridColNumKey } from "@sudoku/core/model/GridColNumKey";
import { GridRowColKey } from "@sudoku/core/model/GridRowColKey";
import { GridRowNumKey } from "@sudoku/core/model/GridRowNumKey";
import { BOX_TYPE } from "@sudoku/core/model/type/BoxType";
import { COL_TYPE } from "@sudoku/core/model/type/ColType";
import { ROW_TYPE } from "@sudoku/core/model/type/RowType";
import { SOLUTION_NUMBERS } from "@sudoku/core/model/type/SolutionNumberType";

export const createAllColumns = () => {
  const allColumns: ColumnAdapter[] = [];
  for (const row of ROW_TYPE) {
    for (const col of COL_TYPE) {
      const gridKey = new GridRowColKey(row, col);
      allColumns.push(new ColumnAdapter(gridKey));
    }
  }

  for (const row of ROW_TYPE) {
    for (const num of SOLUTION_NUMBERS) {
      const gridKey = new GridRowNumKey(row, num);
      allColumns.push(new ColumnAdapter(gridKey));
    }
  }

  for (const col of COL_TYPE) {
    for (const num of SOLUTION_NUMBERS) {
      const gridKey = new GridColNumKey(col, num);
      allColumns.push(new ColumnAdapter(gridKey));
    }
  }

  for (const box of BOX_TYPE) {
    for (const num of SOLUTION_NUMBERS) {
      const gridKey = new GridBoxNumKey(box, num);
      allColumns.push(new ColumnAdapter(gridKey));
    }
  }

  return allColumns;
};
