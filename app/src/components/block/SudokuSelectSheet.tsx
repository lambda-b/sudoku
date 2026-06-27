import SudokuButton from "@/components/atom/SudokuButton";
import type { SolveStatus } from "@/services/solver/type";

const cellNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

type SudokuSelectSheetProps = {
  onCellNumberSelect: (cellNumber: number) => void;
  solveStatus: SolveStatus;
};

const SudokuSelectSheet = ({
  onCellNumberSelect,
  solveStatus,
}: SudokuSelectSheetProps) => {
  return (
    <div className="flex items-center justify-center">
      {cellNumbers.map((cellNumber) => {
        return (
          <SudokuButton
            key={cellNumber}
            className="mt-16 border"
            cellNumber={cellNumber}
            onCellNumberSelect={onCellNumberSelect}
            solveStatus={solveStatus}
          />
        );
      })}
    </div>
  );
};

export default SudokuSelectSheet;
