import type { Column } from "@sudoku/core/algorithm/dancinglinks/Column";
import { Matrix } from "@sudoku/core/algorithm/dancinglinks/Matrix";
import { ColumnAdapter } from "@sudoku/core/calc/adapter/ColumnAdapter";
import { RowAdapter } from "@sudoku/core/calc/adapter/RowAdapter";
import { createAllColumns } from "@sudoku/core/calc/factory/SudokuColumnFactory";
import { createAllRows } from "@sudoku/core/calc/factory/SudokuRowFactory";
import { GridOption } from "@sudoku/core/model/GridOption";
import { type ColType, isColType } from "@sudoku/core/model/type/ColType";
import { isRowType, type RowType } from "@sudoku/core/model/type/RowType";
import {
  isSolutionNumberType,
  type SolutionNumberType,
} from "@sudoku/core/model/type/SolutionNumberType";
import { convert } from "@sudoku/core/sudoku";

class SudokuTemplate {
  #allColumns = createAllColumns();

  #covers = createAllRows(ColumnAdapter.converter(this.#allColumns));

  #headers = new Set<Column>(this.#allColumns);

  #matrix = new Matrix(this.#headers);

  setup(data: string) {
    const optionMapper = RowAdapter.converter(this.#covers);

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
            this.#matrix.select(r);
          }
        }
      });
    });
  }

  *solveSudoku(): IterableIterator<GridOption[]> {
    for (const solution of this.#matrix.solveExactCover([])) {
      yield solution.map((row) => (row as RowAdapter).gridOption);
    }
  }
}

export default SudokuTemplate;
