import { ColumnAdapter } from "@sudoku/solver/calc/adapter/ColumnAdapter";
import { GridBoxNumKey } from "@sudoku/solver/model/GridBoxNumKey";
import { GridColNumKey } from "@sudoku/solver/model/GridColNumKey";
import { GridRowColKey } from "@sudoku/solver/model/GridRowColKey";
import { GridRowNumKey } from "@sudoku/solver/model/GridRowNumKey";
import { BOX_TYPE } from "@sudoku/solver/model/type/BoxType";
import { COL_TYPE } from "@sudoku/solver/model/type/ColType";
import { ROW_TYPE } from "@sudoku/solver/model/type/RowType";
import { SOLUTION_NUMBERS } from "@sudoku/solver/model/type/SolutionNumberType";

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
