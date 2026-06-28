import type { SudokuSolveStatusType } from "@sudoku/ui/actions/types";
import { Button } from "@sudoku/ui/primitives/Button";
import { Upload } from "lucide-react";

type UploadButtonProps = {
  onOpen: () => void;
  solveStatus: SudokuSolveStatusType;
};

export const UploadButton = ({ onOpen, solveStatus }: UploadButtonProps) => {
  return (
    <Button
      disabled={solveStatus === "solving"}
      icon={Upload}
      onClick={onOpen}
      size="toolbar"
      text="Upload"
      tone="success"
    />
  );
};
