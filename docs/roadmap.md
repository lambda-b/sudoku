# Sudoku Solver Roadmap

## Recommended order

1. Input validation and solver-state handling
2. Assistance for people solving a puzzle
3. Local storage persistence
4. Human-readable, step-by-step hints
5. Sudoku variants

## 1. Input validation and solver-state handling

This is the foundation for the other features.

- Detect duplicate digits in a row, column, or box before solving.
- Represent `idle`, `invalid`, `solving`, `solved`, `no-solution`,
  `multiple-solutions`, and `stopped` explicitly.
- Search for at most two solutions so a puzzle can be classified as unique or
  ambiguous without enumerating every solution.
- Finish and cancel animation cleanly.
- Keep givens separate from user and solver entries, and prevent editing them.
- Add solver and validation tests.

## 2. Assistance for people solving a puzzle

- Highlight the selected cell's row, column, and box.
- Highlight matching digits and conflicts.
- Visually distinguish givens, user entries, and solver entries.
- Add pencil marks and candidate calculation.
- Add undo and redo.
- Show a clear completion state.

## 3. Local storage persistence

Prefer automatic saving and restoration after the board-state model has been
consolidated. Store a versioned object containing the puzzle, user entries,
candidates, elapsed time, and save timestamp.

## 4. Human-readable, step-by-step hints

Dancing Links is suited to fast exact-cover search, but its backtracking steps
are not good explanations of how a person can solve a puzzle. Build this as a
separate reasoning engine, starting with:

1. Naked Single
2. Hidden Single
3. Locked Candidates
4. Naked Pair

Expose one step first as a Hint action with an explanation and highlighted
cells, then grow it into a full walkthrough.

## 5. Sudoku variants

Start with variants that fit the current exact-cover architecture.

- Diagonal Sudoku: relatively small exact-cover extension.
- Jigsaw Sudoku: generalize region definitions.
- Samurai/linked Sudoku: requires shared cells and a more general board model.
- Killer Sudoku: requires cage UI, sum constraints, and combination handling.

Diagonal Sudoku is the best first variant. Killer and linked puzzles should
wait until constraints and board topology are modeled explicitly.

## Other useful ideas

- Share/import puzzles through URLs.
- Improve mobile layout; the current board has a 630 px minimum width.
- Add undo/redo and input history.
- Optionally use the supplied solution to provide immediate mistake checking.
