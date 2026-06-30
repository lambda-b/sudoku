import {
  ADDRESS_NUMBER,
  isAddressNumber,
} from "@sudoku/core/model/type/AddressNumber";
import { RandomButton } from "@sudoku/ui/actions/RandomButton";
import { ResetButton } from "@sudoku/ui/actions/ResetButton";
import { SolveButton } from "@sudoku/ui/actions/SolveButton";
import { SolveStatusToast } from "@sudoku/ui/actions/SolveStatusToast";
import { UploadButton } from "@sudoku/ui/actions/UploadButton";
import { UploadModal } from "@sudoku/ui/actions/UploadModal";
import { SudokuBoard } from "@sudoku/ui/sudoku/SudokuBoard";
import { SudokuNumberPad } from "@sudoku/ui/sudoku/SudokuNumberPad";
import type { SudokuUiCell } from "@sudoku/ui/sudoku/types";
import { useCallback, useState } from "react";
import { useSudokuOcr } from "@/services/ocr/useSudokuOcr";
import { useRandomPuzzleLoader } from "@/services/random-loader/useRandomPuzzleLoader";
import { validate } from "@/services/solver/api/validate";
import type { SolveStatus } from "@/services/solver/type";
import { useSudokuSolver } from "@/services/solver/useSudokuSolver";
import { useSudokuStore } from "@/services/sudoku-storage/useSudokuStore";

const INITIAL_SUDOKU_DATA =
  "081070250000040000290805073025000480700908006008000900800401002060000010000506000";

const createCells = (puzzle: string): SudokuUiCell[] =>
  ADDRESS_NUMBER.map((address) => {
    const cellNumber = Number(puzzle[address] ?? "0");

    return {
      cellNumber,
      initialCellNumber: cellNumber,
      address,
      status: "default",
    };
  });

const cellsToTable = (cells: SudokuUiCell[]) =>
  cells.map((cell) => cell.cellNumber).join("");

const applyCellStatuses = (
  cells: SudokuUiCell[],
  conflicts: number[],
): SudokuUiCell[] => {
  const conflictSet = new Set(conflicts);

  return cells.map((cell) => {
    const status = conflictSet.has(cell.address) ? "conflict" : "default";
    return cell.status === status ? cell : { ...cell, status };
  });
};

const validateCells = (cells: SudokuUiCell[]) => {
  const validation = validate(cellsToTable(cells));
  return applyCellStatuses(cells, validation.valid ? [] : validation.conflicts);
};

const Sudoku = () => {
  const [cells, setCells] = useSudokuStore(() =>
    createCells(INITIAL_SUDOKU_DATA),
  );
  const [selectedAddress, setSelectedAddress] = useState<number | -1>(-1);
  const [solveStatus, setSolveStatus] = useState<SolveStatus>("idle");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const selectCell = useCallback((address: number | -1) => {
    setSelectedAddress(address);
  }, []);

  const updateCellNumber = useCallback(
    (address: number, cellNumber: number) => {
      if (solveStatus === "solving") {
        return;
      }

      setSolveStatus("idle");
      setCells((currentCells) => {
        const nextCells = currentCells.map((cell) => {
          if (cell.address === address) {
            if (cell.initialCellNumber !== 0) {
              return cell;
            }

            return cell.cellNumber === cellNumber && cell.status === "default"
              ? cell
              : { ...cell, cellNumber, status: "default" as const };
          }

          return cell.status === "default"
            ? cell
            : { ...cell, status: "default" as const };
        });

        return validateCells(nextCells);
      });
    },
    [setCells, solveStatus],
  );

  const applyTable = useCallback(
    (nextTable: string) => {
      if (nextTable.length !== ADDRESS_NUMBER.length) {
        return;
      }

      setCells((currentCells) => {
        const nextCells = currentCells.map((cell, address) => {
          const cellNumber = Number(nextTable[address]);
          return cell.cellNumber === cellNumber && cell.status === "default"
            ? cell
            : { ...cell, cellNumber, status: "default" as const };
        });

        return validateCells(nextCells);
      });
    },
    [setCells],
  );

  const applyPuzzle = useCallback(
    (nextPuzzle: string) => {
      if (nextPuzzle.length !== ADDRESS_NUMBER.length) {
        return;
      }

      setSolveStatus("idle");
      setSelectedAddress(-1);
      setCells(validateCells(createCells(nextPuzzle)));
    },
    [setCells],
  );

  const updateCellStatuses = useCallback(
    (conflicts: number[]) => {
      setCells((currentCells) => applyCellStatuses(currentCells, conflicts));
    },
    [setCells],
  );

  const resetPuzzle = useCallback(() => {
    setSolveStatus("idle");
    setCells((currentCells) => {
      const nextCells = currentCells.map((cell) => {
        const nextCell = {
          ...cell,
          cellNumber: cell.initialCellNumber,
          status: "default" as const,
        };

        return cell.cellNumber === nextCell.cellNumber &&
          cell.status === nextCell.status
          ? cell
          : nextCell;
      });

      return validateCells(nextCells);
    });
  }, [setCells]);

  const inputSelectedNumber = useCallback(
    (cellNumber: number) => {
      if (isAddressNumber(selectedAddress)) {
        updateCellNumber(selectedAddress, cellNumber);
      }
    },
    [selectedAddress, updateCellNumber],
  );
  const randomPuzzle = useRandomPuzzleLoader({ onPuzzleLoad: applyPuzzle });
  const ocr = useSudokuOcr();
  const solver = useSudokuSolver({
    onConflictsChange: updateCellStatuses,
    onStatusChange: setSolveStatus,
    onTableChange: applyTable,
    solveStatus,
    table: cellsToTable(cells),
  });

  return (
    <div className="mx-auto w-[min(630px,calc(100vw-16px))] text-center [--sudoku-board:calc(var(--sudoku-cell)*9)] [--sudoku-cell:min(70px,calc((100vw-16px)/9))]">
      <div className="w-[var(--sudoku-board)]">
        <div className="mx-auto my-3 flex w-[var(--sudoku-board)] flex-col gap-2">
          <div className="flex items-center justify-between gap-1 sm:gap-3">
            <RandomButton
              error={randomPuzzle.error}
              loading={randomPuzzle.loading}
              onLoad={() => void randomPuzzle.load()}
              solveStatus={solveStatus}
            />
            <UploadButton
              onOpen={() => setIsUploadOpen(true)}
              solveStatus={solveStatus}
            />
            <UploadModal
              hasResult={!!ocr.result}
              isOpen={isUploadOpen}
              message={ocr.message}
              onClose={() => setIsUploadOpen(false)}
              onFileRecognize={ocr.recognize}
              onPuzzleApply={applyPuzzle}
              onReset={ocr.reset}
              processing={ocr.processing}
              showEditor={ocr.showEditor}
            />
            <ResetButton onReset={resetPuzzle} solveStatus={solveStatus} />
            <SolveButton
              onSolve={solver.solve}
              onStop={solver.stop}
              solveStatus={solveStatus}
            />
          </div>
          <SolveStatusToast
            onSolve={solver.solve}
            onStop={solver.stop}
            solveStatus={solveStatus}
          />
        </div>
        <SudokuBoard
          cells={cells}
          disabled={solveStatus === "solving"}
          onCellNumberChange={updateCellNumber}
          onCellSelect={selectCell}
          selectedAddress={selectedAddress}
        />
        <SudokuNumberPad
          disabled={solveStatus === "solving"}
          onNumberSelect={inputSelectedNumber}
        />
      </div>
    </div>
  );
};

export default Sudoku;
