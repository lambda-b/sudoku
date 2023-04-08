import SudokuButton from '@/components/atom/SudokuButton';

const SudokuSelectSheet = () => {
  return (
    <div className='flex flex-middle flex-center'>
      {[...Array(9)].map((_, index) => {
        return (
          <SudokuButton
            key={index}
            className="sudoku-cell-5 mt-x-8"
            cellNumber={index + 1}
          />
        );
      })}
    </div>
  );
};

export default SudokuSelectSheet;
