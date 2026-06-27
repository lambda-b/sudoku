import type { SudokuOcrResult } from "@sudoku/ocr";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export type RecognizeSudokuOcr = ReturnType<typeof useSudokuOcr>["recognize"];

export const useSudokuOcr = () => {
  const [message, setMessage] = useState("");

  const mutation = useMutation<SudokuOcrResult, Error, File>({
    mutationFn: async (file) => {
      const { recognizeSudokuFromImage } = await import("@sudoku/ocr");

      return recognizeSudokuFromImage(file, {
        onProgress: ({ progress, status }) => {
          setMessage(`${status} ${Math.round(progress * 100)}%`);
        },
      });
    },
    onMutate: () => {
      setMessage("Loading OCR");
    },
    onSuccess: (result) => {
      setMessage(`OCR confidence ${Math.round(result.confidence)}%`);
    },
    onError: (error) => {
      setMessage(error.message);
    },
  });

  const reset = () => {
    mutation.reset();
    setMessage("");
  };

  return {
    message,
    processing: mutation.isPending,
    recognize: mutation.mutate,
    reset,
    result: mutation.data,
    showEditor: mutation.isSuccess || mutation.isError,
  };
};
