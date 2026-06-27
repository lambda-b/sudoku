import { useSetAtom } from "jotai";
import { type ChangeEvent, useRef, useState } from "react";
import { puzzleState, tableState } from "@/base/jotai/cell";
import { solveStatusState } from "@/base/jotai/solver";

type OcrStatus = "idle" | "loading" | "recognizing" | "ready" | "error";

const cellIndexes = Array.from({ length: 81 }, (_, index) => index);

const normalizePuzzle = (value: string) =>
  value
    .replace(/[^0-9]/g, "")
    .slice(0, 81)
    .padEnd(81, "0");

export const SudokuOcrImporter = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const setPuzzle = useSetAtom(puzzleState);
  const setTable = useSetAtom(tableState);
  const setSolveStatus = useSetAtom(solveStatusState);
  const [status, setStatus] = useState<OcrStatus>("idle");
  const [message, setMessage] = useState("");
  const [puzzleDraft, setPuzzleDraft] = useState("");
  const [rawText, setRawText] = useState("");

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setStatus("loading");
    setMessage("Loading OCR");
    setRawText("");

    try {
      const { recognizeSudokuFromImage } = await import("@sudoku/ocr");

      setStatus("recognizing");
      const result = await recognizeSudokuFromImage(file, {
        onProgress: ({ progress, status }) => {
          setMessage(`${status} ${Math.round(progress * 100)}%`);
        },
      });

      setPuzzleDraft(result.puzzle);
      setRawText(result.rawText.trim());
      setStatus("ready");
      setMessage(`OCR confidence ${Math.round(result.confidence)}%`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "OCR failed");
    }
  };

  const updateCell = (index: number, value: string) => {
    const nextValue = value.replace(/[^0-9]/g, "").slice(-1) || "0";
    const cells = normalizePuzzle(puzzleDraft).split("");
    cells[index] = nextValue;
    setPuzzleDraft(cells.join(""));
  };

  const applyPuzzle = () => {
    const puzzle = normalizePuzzle(puzzleDraft);
    setSolveStatus("idle");
    setPuzzle(puzzle);
    setTable(puzzle);
    setStatus("idle");
    setMessage("");
  };

  const processing = status === "loading" || status === "recognizing";
  const showEditor = status === "ready" || status === "error";
  const draft = normalizePuzzle(puzzleDraft);

  return (
    <div className="text-left">
      <input
        ref={inputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        type="file"
      />
      <button
        className="cursor-pointer rounded border border-emerald-600 px-4 py-2 font-medium text-emerald-700 transition-colors hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-60"
        disabled={processing}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        {processing ? "OCR" : "Upload"}
      </button>
      {message && (
        <span className="ml-3 align-middle text-sm text-zinc-600">
          {message}
        </span>
      )}
      {showEditor && (
        <div className="mt-3 w-[630px] rounded border border-zinc-300 bg-white p-3 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="m-0 text-sm font-medium text-zinc-700">
              Review OCR result
            </p>
            <button
              className="cursor-pointer rounded border border-emerald-600 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
              onClick={applyPuzzle}
              type="button"
            >
              Apply
            </button>
          </div>
          <div className="grid w-[306px] grid-cols-9 border-[2px] border-zinc-800">
            {cellIndexes.map((index) => {
              const row = Math.floor(index / 9);
              const col = index % 9;

              return (
                <input
                  key={index}
                  aria-label={`OCR cell ${index + 1}`}
                  className={[
                    "h-8 w-8 border border-zinc-300 text-center text-lg outline-none focus:bg-emerald-50",
                    col === 2 || col === 5 ? "border-r-zinc-800" : "",
                    row === 2 || row === 5 ? "border-b-zinc-800" : "",
                  ].join(" ")}
                  inputMode="numeric"
                  maxLength={1}
                  onChange={(event) => updateCell(index, event.target.value)}
                  value={draft[index] === "0" ? "" : draft[index]}
                />
              );
            })}
          </div>
          {rawText && (
            <details className="mt-3 text-sm text-zinc-600">
              <summary className="cursor-pointer">Raw OCR text</summary>
              <pre className="mt-2 max-h-28 overflow-auto whitespace-pre-wrap rounded bg-zinc-50 p-2">
                {rawText}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
};
