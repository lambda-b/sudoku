import { Column } from "@/algorithm/dancinglinks/Column";
import { Matrix } from "@/algorithm/dancinglinks/Matrix";
import { convert } from "@/base/function";
import { ColumnAdapter } from "@/calc/adapter/ColumnAdapter";
import { RowAdapter } from "@/calc/adapter/RowAdapter";
import { SudokuColumnFactory } from "@/calc/factory/SudokuColumnFactory";
import { SudokuRowFactory } from "@/calc/factory/SudokuRowFactory";
import { GridKey } from "@/model/GridKey";
import { GridOption } from "@/model/GridOption";
import { ColType, isColType } from "@/model/type/ColType";
import { RowType, isRowType } from "@/model/type/RowType";
import { SolutionNumberType, isSolutionNumberType } from "@/model/type/SolutionNumberType";
import { IdMap } from "@/utility/IdMap";

class SudokuTemplate {
  private feasibles = new IdMap<GridKey, GridOption[]>();

  private headers = new Set<Column>();

  private matrix = new Matrix(this.headers);

  public setup(data: string) {
    const allColumns = SudokuColumnFactory.createAllColumns();
    const covers = SudokuRowFactory.createAllRows(ColumnAdapter.converter(allColumns));
    for (const row of covers) {
      for (const { col } of row.getForwardNodes()) {
        this.headers.add(col);
      }
    }

    const optionMapper = RowAdapter.converter(covers);

    const grid = convert(data);
    grid.forEach((row, i) => {
      row.forEach((num, j) => {
        if (isSolutionNumberType(num) && isRowType(i) && isColType(j)) {
          const option = new GridOption(
            i as RowType,
            j as ColType,
            num as SolutionNumberType,
          );
          const r = optionMapper.get(option);
          if (r) {
            this.matrix.select(r);
          }
        }
      });
    });
  }

  public *solveSudoku(): IterableIterator<GridOption[]> {
    for (const solution of this.matrix.solveExactCover([])) {
      yield solution.map(row => (row as RowAdapter).gridOption);
    }
  }
}

export default SudokuTemplate;
