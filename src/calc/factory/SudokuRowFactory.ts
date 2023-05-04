import { LinkNode } from "@/algorithm/dancinglinks/LinkNode";
import { ColumnAdapter } from "@/calc/adapter/ColumnAdapter";
import { RowAdapter } from "@/calc/adapter/RowAdapter";
import { GridBoxNumKey } from "@/model/GridBoxNumKey";
import { GridColNumKey } from "@/model/GridColNumKey";
import { GridKey } from "@/model/GridKey";
import { GridOption } from "@/model/GridOption";
import { GridRowColKey } from "@/model/GridRowColKey";
import { GridRowNumKey } from "@/model/GridRowNumKey";
import { COL_TYPE } from "@/model/type/ColType";
import { ROW_TYPE } from "@/model/type/RowType";
import { SOLUTION_NUMBERS } from "@/model/type/SolutionNumberType";

export class SudokuRowFactory {

  public static createAllRows(allColumns: Map<GridKey, ColumnAdapter>) {

    const covers: RowAdapter[] = [];

    for (const row of ROW_TYPE) {
      for (const col of COL_TYPE) {
        for (const num of SOLUTION_NUMBERS) {
          const option = new GridOption(row, col, num);
          const algRow = SudokuRowFactory.createRow(allColumns, option);
          covers.push(algRow);
        }
      }
    }

    return covers;
  }

  private static createRow(allColumns: Map<GridKey, ColumnAdapter>, option: GridOption) {
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
    const box = Math.floor(option.row / b) * b + Math.floor(option.col / b);
    const key4 = new GridBoxNumKey(box, option.num);
    const column4 = allColumns.get(key4);
    if (!column4) {
      throw Error("undefined");
    }
    LinkNode.create(row, column4);

    return row;
  }
}