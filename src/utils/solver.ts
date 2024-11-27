// Type definition for a 2D Sudoku board
type Board = number[][];
   
// Helper function to check if a number is valid in a specific cell
const isValid = (board: Board, row: number, col: number, num: number): boolean => {
  for (let i = 0; i < 9; i++) {
    // Check the row and column
    if (board[row][i] === num || board[i][col] === num) return false;

    // Check the 3x3 subgrid
    const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const boxCol = 3 * Math.floor(col / 3) + (i % 3);
    if (board[boxRow][boxCol] === num) return false;
  } 
  return true;
};


// Solver function using backtracking
export const solveSudoku = (board: Board): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) { // Empty cell
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num; // Place the number
            if (solveSudoku(board)) return true; // Recurse
            board[row][col] = 0; // Undo placement (backtracking)
          }
        }
        return false; // Trigger backtracking if no number fits
      }
    }
  }
  return true; // Puzzle is solved
};
