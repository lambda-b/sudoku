import { SelectAddressContext, SudokuDataContext } from "@/foundation/context";
import { convert, handleKeyDown } from "@/foundation/function";
import { useContext, useEffect, useState } from "react";
import SudokuCell from "@/components/atom/SudokuCell";

const SudokuTable = () => {

  const { data, dispatchData } = useContext(SudokuDataContext);

  const { selectedAddress, dispatchAddress } = useContext(SelectAddressContext);

  const [sudokuData, setSudokuData] = useState<number[][]>(
    [...Array(9)].map(() => [...Array(9)].map(() => 0))
  );

  useEffect(() => {
    if (data.length === 81) {
      setSudokuData(convert(data));
    }
  }, [data]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) =>
      handleKeyDown(event, selectedAddress, dispatchAddress, dispatchData);
    document.addEventListener('keydown', handler, false);

    return () => document.removeEventListener('keydown', handler);
  }, [selectedAddress, dispatchAddress, dispatchData]);

  return (
    <div className="sudoku-table">
      {sudokuData.map((record, rowIdx) => {
        return (
          <div key={rowIdx} className="flex flex-middle flex-center">
            {record.map((cellNumber, colIdx) => {

              const type = 3 * (rowIdx % 3) + (colIdx % 3) + 1;
              const address = 9 * rowIdx + colIdx;

              return (
                <SudokuCell
                  key={address}
                  className={`sudoku-cell-${type}`}
                  cellNumber={cellNumber}
                  address={address}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default SudokuTable;
