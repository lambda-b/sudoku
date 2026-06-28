import { Button } from "@sudoku/ui/primitives/Button";
import { Modal } from "@sudoku/ui/primitives/Modal";
import { SudokuBoard } from "@sudoku/ui/sudoku/SudokuBoard";
import { SudokuNumberPad } from "@sudoku/ui/sudoku/SudokuNumberPad";
import type { SudokuUiCell } from "@sudoku/ui/sudoku/types";
import { Check, ImageUp, Upload } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";

type SudokuOcrRecognitionResult = {
  puzzle: string;
};

export type UploadRecognize = (
  file: File,
  options?: {
    onSuccess?: (result: SudokuOcrRecognitionResult) => void;
  },
) => void;

const normalizePuzzle = (value: string) =>
  value
    .replace(/[^0-9]/g, "")
    .slice(0, 81)
    .padEnd(81, "0");

const createPreviewCells = (puzzle: string): SudokuUiCell[] =>
  normalizePuzzle(puzzle)
    .split("")
    .map((value, address) => ({
      address,
      cellNumber: Number(value),
      initialCellNumber: 0,
      status: "default",
    }));

type UploadButtonProps = {
  hasResult: boolean;
  message: string;
  onFileRecognize: UploadRecognize;
  onPuzzleApply: (puzzle: string) => void;
  onReset: () => void;
  processing: boolean;
  showEditor: boolean;
};

export const UploadButton = ({
  hasResult,
  message,
  onFileRecognize,
  onPuzzleApply,
  onReset,
  processing,
  showEditor,
}: UploadButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [puzzleDraft, setPuzzleDraft] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<number | -1>(-1);
  const draft = normalizePuzzle(puzzleDraft);
  const previewCells = createPreviewCells(draft);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setSelectedAddress(-1);
    onFileRecognize(file, {
      onSuccess: (result) => {
        setPuzzleDraft(result.puzzle);
      },
    });
  };

  const updateCell = (address: number, cellNumber: number) => {
    const cells = normalizePuzzle(puzzleDraft).split("");
    cells[address] = String(cellNumber);
    setPuzzleDraft(cells.join(""));
  };

  const inputSelectedCellNumber = (cellNumber: number) => {
    if (selectedAddress !== -1) {
      updateCell(selectedAddress, cellNumber);
    }
  };

  const applyPuzzle = () => {
    const puzzle = normalizePuzzle(puzzleDraft);
    onPuzzleApply(puzzle);
    onReset();
    setSelectedAddress(-1);
    setIsOpen(false);
  };

  return (
    <>
      <input
        ref={inputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        type="file"
      />
      <Button
        disabled={processing}
        onClick={() => setIsOpen(true)}
        size="toolbar"
        tone="success"
      >
        <Upload
          aria-hidden="true"
          className="size-3.5 sm:size-4"
          strokeWidth={2}
        />
        {processing ? "OCR" : "Upload"}
      </Button>
      <Modal
        closeDisabled={processing}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="OCR Import"
      >
        <div className="mb-4 flex items-center gap-3">
          <Button
            disabled={processing}
            onClick={() => inputRef.current?.click()}
            tone="success"
          >
            <ImageUp aria-hidden="true" size={16} strokeWidth={2} />
            {processing ? "OCR" : "Choose Image"}
          </Button>
          {message && <span className="text-sm text-zinc-600">{message}</span>}
        </div>
        {showEditor && hasResult && (
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="m-0 text-sm font-medium text-zinc-700">
                Review OCR result
              </p>
              <Button onClick={applyPuzzle} size="small" tone="success">
                <Check aria-hidden="true" size={14} strokeWidth={2} />
                Apply
              </Button>
            </div>
            <div className="mx-auto w-[var(--sudoku-board)] [--sudoku-board:calc(var(--sudoku-cell)*9)] [--sudoku-cell:min(34px,calc((100vw-64px)/9))]">
              <SudokuBoard
                cells={previewCells}
                onCellNumberChange={updateCell}
                onCellSelect={setSelectedAddress}
                selectedAddress={selectedAddress}
              />
              <SudokuNumberPad onNumberSelect={inputSelectedCellNumber} />
            </div>
          </div>
        )}
        {!showEditor && !message && (
          <div className="h-28 rounded border border-dashed border-zinc-300" />
        )}
      </Modal>
    </>
  );
};
