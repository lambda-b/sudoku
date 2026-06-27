import SudokuCell from "@/components/atom/SudokuCell";

const rows = Array.from({ length: 9 }, (_, rowIdx) =>
  Array.from({ length: 9 }, (_, colIdx) => 9 * rowIdx + colIdx),
);

const cellBorders = [
  "border-t-[3px] border-b border-l-[3px] border-r",
  "border-t-[3px] border-b border-x",
  "border-t-[3px] border-b border-l border-r-[3px]",
  "border-t border-b border-l-[3px] border-r",
  "border",
  "border-t border-b border-l border-r-[3px]",
  "border-t border-b-[3px] border-l-[3px] border-r",
  "border-t border-b-[3px] border-x",
  "border-t border-b-[3px] border-l border-r-[3px]",
];

const SudokuTable = () => {
  return (
    <div className="mx-auto min-h-[630px] min-w-[630px] px-0">
      {rows.map((row) => {
        const rowIdx = Math.floor(row[0] / 9);

        return (
          <div
            key={`row-${row[0]}`}
            className="flex items-center justify-center"
          >
            {row.map((address) => {
              const colIdx = address % 9;
              const type = 3 * (rowIdx % 3) + (colIdx % 3) + 1;

              return (
                <SudokuCell
                  key={address}
                  className={cellBorders[type - 1]}
                  address={address}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default SudokuTable;
