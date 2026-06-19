import SudokuButton from "@/components/atom/SudokuButton";

const cellNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const SudokuSelectSheet = () => {
  return (
    <div className="flex items-center justify-center">
      {cellNumbers.map((cellNumber) => {
        return (
          <SudokuButton
            key={cellNumber}
            className="mt-16 border"
            cellNumber={cellNumber}
          />
        );
      })}
    </div>
  );
};

export default SudokuSelectSheet;
