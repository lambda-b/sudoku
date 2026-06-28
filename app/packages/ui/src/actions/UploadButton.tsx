import type { SolveStatusType } from "@sudoku/ui/actions/types";
import { Button } from "@sudoku/ui/primitives/Button";
import { Upload } from "lucide-react";

const toolbarButtonClassName =
  "inline-flex items-center gap-1 rounded border border-emerald-600 px-2 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-60 sm:gap-2 sm:px-4 sm:py-2 sm:text-base";

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
      className={toolbarButtonClassName}
      text="Upload"
    />
  );
};
