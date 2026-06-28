import { SudokuNumberButton } from "@sudoku/ui/sudoku/SudokuNumberButton";

const cellNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

type SudokuNumberPadProps = {
  disabled?: boolean;
  onNumberSelect: (cellNumber: number) => void;
};

export const SudokuNumberPad = ({
  disabled = false,
  onNumberSelect,
}: SudokuNumberPadProps) => {
  return (
    <div className="flex items-center justify-center">
      {cellNumbers.map((cellNumber) => {
        return (
          <SudokuNumberButton
            key={cellNumber}
            className="mt-[calc(var(--sudoku-cell)*0.914)] border"
            disabled={disabled}
            number={cellNumber}
            onNumberSelect={onNumberSelect}
          />
        );
      })}
    </div>
  );
};
