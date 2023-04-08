import ColumnAdapter from "@/algorithm/adapter/ColumnAdapter";
import RowAdapter from "@/algorithm/adapter/RowAdapter";
import DancingLinks from "@/algorithm/DancingLinks";
import { convert } from "@/base/function";
import { GridKey } from "@/model/GridKey";
import { GridOption } from "@/model/GridOption";
import { ColType, COL_TYPE, isColType } from "@/model/type/ColType";
import { isRowType, RowType, ROW_TYPE } from "@/model/type/RowType";
import { isSolutionNumberType, SolutionNumberType, SOLUTION_NUMBERS } from "@/model/type/SolutionNumberType";
import { IdMap } from "@/utility/IdMap";
import { IdSet } from "@/utility/IdSet";

class SudokuConfig {
  private feasibles = new IdMap<GridKey, GridOption[]>();

  private headers = new IdSet<ColumnAdapter>();

  private matrix = new DancingLinks.Matrix<RowAdapter, ColumnAdapter>(this.headers);

  private get allCovers() {
    const covers: RowAdapter[] = [];

    for (const row of ROW_TYPE) {
      for (const col of COL_TYPE) {
        for (const num of SOLUTION_NUMBERS) {
          const option = new GridOption(row, col, num);
          covers.push(new RowAdapter(option));
        }
      }
    }

    return covers;
  }

  public initialize() {
    this.feasibles.clear();
    ColumnAdapter.setFeasibles(this.feasibles);
    this.headers.clear();
    RowAdapter.setFeasible(this.feasibles);

    const covers = this.allCovers;
    for (const row of covers) {
      for (const [_, col] of row.getForwardNodes()) {
        const equivalences = this.feasibles.get(col.gridKey);
        if (equivalences) {
          equivalences.push(row.gridOption);
        } else {
          this.feasibles.set(col.gridKey, [row.gridOption]);
        }
        this.headers.add(col);
      }
    }
  };

  public preSelectGridOption(data: string) {
    const grid = convert(data);
    grid.forEach((row, i) => {
      row.forEach((num, j) => {
        if (isSolutionNumberType(num) && isRowType(i) && isColType(j)) {
          const option = new GridOption(
            i as RowType,
            j as ColType,
            num as SolutionNumberType,
          );
          this.matrix.select(new RowAdapter(option));
        }
      });
    });
  };

  get beanMatrix() {
    return this.matrix;
  }
}

export default SudokuConfig;
