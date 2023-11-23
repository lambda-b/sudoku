import { SudokuDataContext } from "@/base/context";
import { keyOperationSelector } from "@/base/keyboard";
import { tableState } from "@/base/recoil";
import SudokuCell from "@/components/atom/SudokuCell";
import { useContext, useEffect } from "react";
import { useSetRecoilState } from "recoil";

const shape = [...Array(9)].map(() => [...Array(9)]);

const SudokuTable = () => {

  const { data } = useContext(SudokuDataContext);

  const setSudokuData = useSetRecoilState(tableState);

  const handleKey = useSetRecoilState(keyOperationSelector);

  useEffect(() => {
    setSudokuData(data);
  }, [data]);


  useEffect(() => {
    document.addEventListener('keydown', handleKey, false);

    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return <>
    <div className="sudoku-table">
      {shape.map((row, rowIdx) => {
        return (
          <div key={rowIdx} className="flex flex-middle flex-center">
            {row.map((_, colIdx) => {

              const type = 3 * (rowIdx % 3) + (colIdx % 3) + 1;
              const address = 9 * rowIdx + colIdx;

              return (
                <SudokuCell
                  key={address}
                  className={`sudoku-cell-${type}`}
                  address={address}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  </>;
};

export default SudokuTable;
