import { handleRecoilByKey } from "@/base/keyboard";
import SudokuCell from "@/components/atom/SudokuCell";
import { useEffect } from "react";
import { useRecoilCallback } from "recoil";

const shape = [...Array(9)].map(() => [...Array(9)]);

const SudokuTable = () => {

  const handleKey = useRecoilCallback((opts) => {
    return (event: KeyboardEvent) => handleRecoilByKey(opts, event);
  }, []);

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
