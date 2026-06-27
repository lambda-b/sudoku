import {
  ADDRESS_NUMBER,
  isAddressNumber,
} from "@sudoku/core/model/type/AddressNumber";
import { useCallback, useState } from "react";
import { SudokuOcrImporter } from "@/components/block/SudokuOcrImporter";
import { SudokuPuzzleLoader } from "@/components/block/SudokuPuzzleLoader";
import { SudokuResetButton } from "@/components/block/SudokuResetButton";
import SudokuSelectSheet from "@/components/block/SudokuSelectSheet";
import { SudokuSolveButton } from "@/components/block/SudokuSolveButton";
import { SudokuSolveStatus } from "@/components/block/SudokuSolveStatus";
import SudokuTable from "@/components/block/SudokuTable";
import type { SudokuCellModel } from "@/model/SudokuCellModel";
import type { SolveStatus } from "@/services/type";

const INITIAL_SUDOKU_DATA =
  "081070250000040000290805073025000480700908006008000900800401002060000010000506000";

const createCells = (puzzle: string): SudokuCellModel[] =>
  ADDRESS_NUMBER.map((address) => {
    const cellNumber = Number(puzzle[address] ?? "0");

    return {
      cellNumber,
      initialCellNumber: cellNumber,
      address,
      status: "default",
    };
  });

const cellsToTable = (cells: SudokuCellModel[]) =>
  cells.map((cell) => cell.cellNumber).join("");

const Sudoku = () => {
  const [cells, setCells] = useState(() => createCells(INITIAL_SUDOKU_DATA));
  const [selectedAddress, setSelectedAddress] = useState<number | -1>(-1);
  const [solveStatus, setSolveStatus] = useState<SolveStatus>("idle");

  const selectCell = useCallback((address: number | -1) => {
    setSelectedAddress(address);
  }, []);

  const updateCellNumber = useCallback(
    (address: number, cellNumber: number) => {
      if (solveStatus === "solving") {
        return;
      }

      setSolveStatus("idle");
      setCells((currentCells) =>
        currentCells.map((cell) => {
          if (cell.address === address) {
            if (cell.initialCellNumber !== 0) {
              return cell;
            }

            return cell.cellNumber === cellNumber && cell.status === "default"
              ? cell
              : { ...cell, cellNumber, status: "default" };
          }

          return cell.status === "default"
            ? cell
            : { ...cell, status: "default" };
        }),
      );
    },
    [solveStatus],
  );

  const applyTable = useCallback((nextTable: string) => {
    if (nextTable.length !== ADDRESS_NUMBER.length) {
      return;
    }

    setCells((currentCells) =>
      currentCells.map((cell, address) => {
        const cellNumber = Number(nextTable[address]);
        return cell.cellNumber === cellNumber && cell.status === "default"
          ? cell
          : { ...cell, cellNumber, status: "default" };
      }),
    );
  }, []);

  const applyPuzzle = useCallback((nextPuzzle: string) => {
    if (nextPuzzle.length !== ADDRESS_NUMBER.length) {
      return;
    }

    setSolveStatus("idle");
    setSelectedAddress(-1);
    setCells(createCells(nextPuzzle));
  }, []);

  const updateCellStatuses = useCallback((conflicts: number[]) => {
    const conflictSet = new Set(conflicts);
    setCells((currentCells) =>
      currentCells.map((cell) => {
        const status = conflictSet.has(cell.address) ? "conflict" : "default";
        return cell.status === status ? cell : { ...cell, status };
      }),
    );
  }, []);

  const resetPuzzle = useCallback(() => {
    setSolveStatus("idle");
    setCells((currentCells) =>
      currentCells.map((cell) => {
        const nextCell = {
          ...cell,
          cellNumber: cell.initialCellNumber,
          status: "default" as const,
        };

        return cell.cellNumber === nextCell.cellNumber &&
          cell.status === nextCell.status
          ? cell
          : nextCell;
      }),
    );
  }, []);

  const inputSelectedNumber = useCallback(
    (cellNumber: number) => {
      if (isAddressNumber(selectedAddress)) {
        updateCellNumber(selectedAddress, cellNumber);
      }
    },
    [selectedAddress, updateCellNumber],
  );

  return (
    <div className="mx-auto w-[min(630px,calc(100vw-16px))] text-center [--sudoku-scale:min(1,calc((100vw-16px)/630px))]">
      <div className="w-[630px] origin-top-left [zoom:var(--sudoku-scale)]">
        <div className="mx-auto my-3 flex w-[630px] items-center justify-between">
          <div className="flex items-center gap-3">
            <SudokuPuzzleLoader
              onPuzzleLoad={applyPuzzle}
              solveStatus={solveStatus}
            />
            <SudokuOcrImporter onPuzzleApply={applyPuzzle} />
            <SudokuResetButton
              onReset={resetPuzzle}
              solveStatus={solveStatus}
            />
            <SudokuSolveButton
              onSolveStatusChange={setSolveStatus}
              onTableChange={applyTable}
              onUpdateCellStatuses={updateCellStatuses}
              solveStatus={solveStatus}
              table={cellsToTable(cells)}
            />
          </div>
          <SudokuSolveStatus solveStatus={solveStatus} />
        </div>
        <SudokuTable
          cells={cells}
          onCellNumberChange={updateCellNumber}
          onCellSelect={selectCell}
          selectedAddress={selectedAddress}
          solveStatus={solveStatus}
        />
        <SudokuSelectSheet
          onCellNumberSelect={inputSelectedNumber}
          solveStatus={solveStatus}
        />
      </div>
    </div>
  );
};

export default Sudoku;
