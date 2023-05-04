import { ColumnAdapter } from "@/calc/adapter/ColumnAdapter";
import { GridBoxNumKey } from "@/model/GridBoxNumKey";
import { GridColNumKey } from "@/model/GridColNumKey";
import { GridRowColKey } from "@/model/GridRowColKey";
import { GridRowNumKey } from "@/model/GridRowNumKey";
import { BOX_TYPE } from "@/model/type/BoxType";
import { COL_TYPE } from "@/model/type/ColType";
import { ROW_TYPE } from "@/model/type/RowType";
import { SOLUTION_NUMBERS } from "@/model/type/SolutionNumberType";

export class SudokuColumnFactory {

  public static createAllColumns() {
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
  }
}