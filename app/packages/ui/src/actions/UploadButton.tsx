import {
  toolbarButtonClassName,
  toolbarButtonToneClassName,
} from "@sudoku/ui/actions/styles";
import type { SolveStatusType } from "@sudoku/ui/actions/types";
import { Button } from "@sudoku/ui/primitives/Button";
import { clsx } from "clsx";
import { Upload } from "lucide-react";

type UploadButtonProps = {
  onOpen: () => void;
  solveStatus: SolveStatusType;
};

export const UploadButton = ({ onOpen, solveStatus }: UploadButtonProps) => {
  return (
    <Button
      disabled={solveStatus === "solving"}
      icon={Upload}
      onClick={onOpen}
      className={clsx(
        toolbarButtonClassName,
        toolbarButtonToneClassName.emerald,
      )}
      text="Upload"
    />
  );
};
