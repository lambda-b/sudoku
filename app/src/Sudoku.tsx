import { isAddressNumber } from "@sudoku/core/model/type/AddressNumber";
import { RandomButton } from "@sudoku/ui/actions/RandomButton";
import { ResetButton } from "@sudoku/ui/actions/ResetButton";
import { SolveButton } from "@sudoku/ui/actions/SolveButton";
import { SolveStatusToast } from "@sudoku/ui/actions/SolveStatusToast";
import { UploadButton } from "@sudoku/ui/actions/UploadButton";
import { UploadModal } from "@sudoku/ui/actions/UploadModal";
import { SudokuBoard } from "@sudoku/ui/sudoku/SudokuBoard";
import { SudokuNumberPad } from "@sudoku/ui/sudoku/SudokuNumberPad";
import { useCallback, useState } from "react";
import { useSudokuOcr } from "@/services/ocr/useSudokuOcr";
import { useRandomPuzzleLoader } from "@/services/random-loader/useRandomPuzzleLoader";
import type { SolveStatus } from "@/services/solver/type";
import { useSudokuSolver } from "@/services/solver/useSudokuSolver";
import {
  createSudokuCells,
  reduceSudokuCells,
  sudokuCellsToTable,
} from "@/services/sudoku-board/sudokuCells";
import { useSudokuStore } from "@/services/sudoku-storage/useSudokuStore";

const INITIAL_SUDOKU_DATA =
  "081070250000040000290805073025000480700908006008000900800401002060000010000506000";

const Sudoku = () => {
  const [cells, setCells] = useSudokuStore(() =>
    createSudokuCells(INITIAL_SUDOKU_DATA),
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
      setCells((currentCells) =>
        reduceSudokuCells(currentCells, {
          type: "cellNumberChanged",
          address,
          cellNumber,
        }),
      );
    },
    [setCells, solveStatus],
  );

  const applyTable = useCallback(
    (nextTable: string) => {
      setCells((currentCells) =>
        reduceSudokuCells(currentCells, {
          type: "tableApplied",
          table: nextTable,
        }),
      );
    },
    [setCells],
  );

  const applyPuzzle = useCallback(
    (nextPuzzle: string) => {
      setSolveStatus("idle");
      setSelectedAddress(-1);
      setCells((currentCells) =>
        reduceSudokuCells(currentCells, {
          type: "puzzleApplied",
          puzzle: nextPuzzle,
        }),
      );
    },
    [setCells],
  );

  const updateCellStatuses = useCallback(
    (conflicts: number[]) => {
      setCells((currentCells) =>
        reduceSudokuCells(currentCells, {
          type: "conflictsChanged",
          conflicts,
        }),
      );
    },
    [setCells],
  );

  const resetPuzzle = useCallback(() => {
    setSolveStatus("idle");
    setCells((currentCells) =>
      reduceSudokuCells(currentCells, {
        type: "reset",
      }),
    );
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
    table: sudokuCellsToTable(cells),
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
