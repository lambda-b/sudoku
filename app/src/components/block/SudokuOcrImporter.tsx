import { Check, ImageUp, Upload } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import { Modal } from "@/components/atom/Modal";
import SudokuSelectSheet from "@/components/block/SudokuSelectSheet";
import SudokuTable from "@/components/block/SudokuTable";
import type { SudokuCellModel } from "@/model/SudokuCellModel";
import { useSudokuOcr } from "@/services/ocr/useSudokuOcr";

const normalizePuzzle = (value: string) =>
  value
    .replace(/[^0-9]/g, "")
    .slice(0, 81)
    .padEnd(81, "0");

const createPreviewCells = (puzzle: string): SudokuCellModel[] =>
  normalizePuzzle(puzzle)
    .split("")
    .map((value, address) => ({
      address,
      cellNumber: Number(value),
      initialCellNumber: 0,
      status: "default",
    }));

type SudokuOcrImporterProps = {
  onPuzzleApply: (puzzle: string) => void;
};

export const SudokuOcrImporter = ({
  onPuzzleApply,
}: SudokuOcrImporterProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [puzzleDraft, setPuzzleDraft] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<number | -1>(-1);
  const { message, processing, recognize, reset, result, showEditor } =
    useSudokuOcr();
  const draft = normalizePuzzle(puzzleDraft);
  const previewCells = createPreviewCells(draft);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setSelectedAddress(-1);
    recognize(file, {
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
    reset();
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
      <button
        className="inline-flex cursor-pointer items-center gap-2 rounded border border-emerald-600 px-4 py-2 font-medium text-emerald-700 transition-colors hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-60"
        disabled={processing}
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <Upload aria-hidden="true" size={16} strokeWidth={2} />
        {processing ? "OCR" : "Upload"}
      </button>
      <Modal
        closeDisabled={processing}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="OCR Import"
      >
        <div className="mb-4 flex items-center gap-3">
          <button
            className="inline-flex cursor-pointer items-center gap-2 rounded border border-emerald-600 px-4 py-2 font-medium text-emerald-700 transition-colors hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-60"
            disabled={processing}
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            <ImageUp aria-hidden="true" size={16} strokeWidth={2} />
            {processing ? "OCR" : "Choose Image"}
          </button>
          {message && <span className="text-sm text-zinc-600">{message}</span>}
        </div>
        {showEditor && result && (
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="m-0 text-sm font-medium text-zinc-700">
                Review OCR result
              </p>
              <button
                className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-emerald-600 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                onClick={applyPuzzle}
                type="button"
              >
                <Check aria-hidden="true" size={14} strokeWidth={2} />
                Apply
              </button>
            </div>
            <div className="h-[372px] w-[306px] overflow-hidden">
              <div className="w-[630px] origin-top-left scale-[0.485714]">
                <SudokuTable
                  cells={previewCells}
                  onCellNumberChange={updateCell}
                  onCellSelect={setSelectedAddress}
                  selectedAddress={selectedAddress}
                  solveStatus="idle"
                />
                <SudokuSelectSheet
                  onCellNumberSelect={inputSelectedCellNumber}
                  solveStatus="idle"
                />
              </div>
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
