import { Column } from "@/algorithm/dancinglinks/Column";
import { Matrix } from "@/algorithm/dancinglinks/Matrix";
import { convert } from "@/base/function";
import { ColumnAdapter } from "@/calc/adapter/ColumnAdapter";
import { RowAdapter } from "@/calc/adapter/RowAdapter";
import { SudokuColumnFactory } from "@/calc/factory/SudokuColumnFactory";
import { SudokuRowFactory } from "@/calc/factory/SudokuRowFactory";
import { GridOption } from "@/model/GridOption";
import { ColType, isColType } from "@/model/type/ColType";
import { RowType, isRowType } from "@/model/type/RowType";
import { SolutionNumberType, isSolutionNumberType } from "@/model/type/SolutionNumberType";

class SudokuTemplate {

  private allColumns = SudokuColumnFactory.createAllColumns();

  private covers = SudokuRowFactory.createAllRows(ColumnAdapter.converter(this.allColumns));

  private headers = new Set<Column>(this.allColumns);

  private matrix = new Matrix(this.headers);

  public setup(data: string) {

    const optionMapper = RowAdapter.converter(this.covers);

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
