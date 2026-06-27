import { createWorker, PSM } from "tesseract.js";

export type SudokuOcrProgress = {
  status: string;
  progress: number;
};

export type SudokuOcrResult = {
  puzzle: string;
  rawText: string;
  confidence: number;
};

export type RecognizeSudokuOptions = {
  onProgress?: (progress: SudokuOcrProgress) => void;
};

const SUDOKU_CELL_COUNT = 81;
const SUDOKU_SIDE = 9;
const MAX_IMAGE_SIZE = 960;
const EMPTY_CELL_DENSITY = 0.018;
const CELL_IMAGE_SIZE = 128;
const CELL_IMAGE_PADDING = 16;

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type PreparedGrid = {
  canvas: HTMLCanvasElement;
  rect: Rect;
};

const normalizeOcrCharacter = (character: string) => {
  if (/[1-9]/.test(character)) {
    return character;
  }

  if (/[0OoQq.·_-]/.test(character)) {
    return "0";
  }

  return "";
};

export const normalizeSudokuOcrText = (text: string) => {
  const cells = Array.from(text, normalizeOcrCharacter)
    .join("")
    .slice(0, SUDOKU_CELL_COUNT);

  return cells.padEnd(SUDOKU_CELL_COUNT, "0");
};

const loadImage = async (image: File | Blob | string) => {
  const imageElement = new Image();
  let objectUrl: string | undefined;

  if (typeof image === "string") {
    imageElement.src = image;
  } else {
    objectUrl = URL.createObjectURL(image);
    imageElement.src = objectUrl;
  }

  try {
    await imageElement.decode();
    return imageElement;
  } finally {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  }
};

const drawImageToCanvas = (image: HTMLImageElement) => {
  const scale = Math.min(
    1,
    MAX_IMAGE_SIZE / Math.max(image.width, image.height),
  );
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("Canvas is not supported");
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  return canvas;
};

const getLuminance = (data: Uint8ClampedArray, index: number) =>
  0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2];

const detectGridRect = (canvas: HTMLCanvasElement): Rect => {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("Canvas is not supported");
  }

  const { data, height, width } = context.getImageData(
    0,
    0,
    canvas.width,
    canvas.height,
  );
  const columnCounts = Array.from({ length: width }, () => 0);
  const rowCounts = Array.from({ length: height }, () => 0);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      if (getLuminance(data, index) < 120) {
        columnCounts[x] += 1;
        rowCounts[y] += 1;
      }
    }
  }

  const minColumnInk = Math.max(3, Math.round(height * 0.16));
  const minRowInk = Math.max(3, Math.round(width * 0.16));
  const columns = columnCounts
    .map((count, index) => ({ count, index }))
    .filter(({ count }) => count >= minColumnInk)
    .map(({ index }) => index);
  const rows = rowCounts
    .map((count, index) => ({ count, index }))
    .filter(({ count }) => count >= minRowInk)
    .map(({ index }) => index);

  if (columns.length < 2 || rows.length < 2) {
    const size = Math.min(width, height);
    return {
      x: Math.round((width - size) / 2),
      y: Math.round((height - size) / 2),
      width: size,
      height: size,
    };
  }

  const x = Math.min(...columns);
  const y = Math.min(...rows);
  const detectedWidth = Math.max(...columns) - x + 1;
  const detectedHeight = Math.max(...rows) - y + 1;
  const size = Math.max(detectedWidth, detectedHeight);

  return {
    x: Math.max(0, Math.round(x - (size - detectedWidth) / 2)),
    y: Math.max(0, Math.round(y - (size - detectedHeight) / 2)),
    width: Math.min(size, width - x),
    height: Math.min(size, height - y),
  };
};

const prepareGrid = async (
  image: File | Blob | string,
): Promise<PreparedGrid> => {
  const imageElement = await loadImage(image);
  const canvas = drawImageToCanvas(imageElement);

  return {
    canvas,
    rect: detectGridRect(canvas),
  };
};

const getCellRect = (grid: PreparedGrid, index: number): Rect => {
  const row = Math.floor(index / SUDOKU_SIDE);
  const col = index % SUDOKU_SIDE;
  const cellWidth = grid.rect.width / SUDOKU_SIDE;
  const cellHeight = grid.rect.height / SUDOKU_SIDE;
  const insetX = cellWidth * 0.12;
  const insetY = cellHeight * 0.12;

  return {
    x: grid.rect.x + col * cellWidth + insetX,
    y: grid.rect.y + row * cellHeight + insetY,
    width: cellWidth - insetX * 2,
    height: cellHeight - insetY * 2,
  };
};

const getCellInkDensity = (grid: PreparedGrid, rect: Rect) => {
  const context = grid.canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("Canvas is not supported");
  }

  const x = Math.round(rect.x);
  const y = Math.round(rect.y);
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const { data } = context.getImageData(x, y, width, height);
  let ink = 0;

  for (let index = 0; index < data.length; index += 4) {
    if (getLuminance(data, index) < 145) {
      ink += 1;
    }
  }

  return ink / (width * height);
};

const drawCellToCanvas = (grid: PreparedGrid, rect: Rect) => {
  const sourceContext = grid.canvas.getContext("2d", {
    willReadFrequently: true,
  });
  if (!sourceContext) {
    throw new Error("Canvas is not supported");
  }

  const canvas = document.createElement("canvas");
  canvas.width = CELL_IMAGE_SIZE;
  canvas.height = CELL_IMAGE_SIZE;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("Canvas is not supported");
  }

  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(
    grid.canvas,
    rect.x,
    rect.y,
    rect.width,
    rect.height,
    CELL_IMAGE_PADDING,
    CELL_IMAGE_PADDING,
    CELL_IMAGE_SIZE - CELL_IMAGE_PADDING * 2,
    CELL_IMAGE_SIZE - CELL_IMAGE_PADDING * 2,
  );

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  for (let index = 0; index < imageData.data.length; index += 4) {
    const luminance = getLuminance(imageData.data, index);
    const value = luminance < 190 ? 0 : 255;
    imageData.data[index] = value;
    imageData.data[index + 1] = value;
    imageData.data[index + 2] = value;
  }
  context.putImageData(imageData, 0, 0);

  return canvas;
};

const normalizeCellText = (text: string) => {
  const digit = text.match(/[1-9]/)?.[0];
  return digit ?? "0";
};

export const recognizeSudokuFromImage = async (
  image: File | Blob | string,
  options: RecognizeSudokuOptions = {},
): Promise<SudokuOcrResult> => {
  options.onProgress?.({ progress: 0, status: "detecting grid" });
  const grid = await prepareGrid(image);
  const worker = await createWorker("eng", 1, {
    logger: (message) => {
      if (message.status !== "recognizing text") {
        options.onProgress?.({
          status: message.status,
          progress: message.progress * 0.1,
        });
      }
    },
  });

  try {
    await worker.setParameters({
      tessedit_char_whitelist: "123456789",
      tessedit_pageseg_mode: PSM.SINGLE_WORD,
    });

    const cells: string[] = [];
    const rawCells: string[] = [];
    const confidenceScores: number[] = [];

    for (let index = 0; index < SUDOKU_CELL_COUNT; index += 1) {
      const rect = getCellRect(grid, index);
      const density = getCellInkDensity(grid, rect);

      if (density < EMPTY_CELL_DENSITY) {
        cells.push("0");
        rawCells.push(".");
      } else {
        const {
          data: { confidence, text },
        } = await worker.recognize(drawCellToCanvas(grid, rect));
        const cell = normalizeCellText(text);

        cells.push(cell);
        rawCells.push(cell === "0" ? "?" : cell);
        confidenceScores.push(confidence);
      }

      options.onProgress?.({
        status: `reading cells ${index + 1}/${SUDOKU_CELL_COUNT}`,
        progress: (index + 1) / SUDOKU_CELL_COUNT,
      });
    }

    const rawText = rawCells
      .reduce<string[]>((rows, cell, index) => {
        const row = Math.floor(index / SUDOKU_SIDE);
        rows[row] = `${rows[row] ?? ""}${cell}`;
        return rows;
      }, [])
      .join("\n");

    return {
      puzzle: cells.join(""),
      rawText,
      confidence:
        confidenceScores.length === 0
          ? 0
          : confidenceScores.reduce((sum, score) => sum + score, 0) /
            confidenceScores.length,
    };
  } finally {
    await worker.terminate();
  }
};
