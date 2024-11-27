// import { solveSudoku } from './solver.ts';
// Utility to shuffle an array
const shuffleArray = (array: number[]): number[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Solve Sudoku using backtracking
const solveSudoku = (board: number[][]): boolean => {
  const findEmpty = (): [number, number] | null => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) return [row, col];
      }
    }
    return null;
  };

  const isValid = (board: number[][], row: number, col: number, num: number): boolean => {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;

      const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const boxCol = 3 * Math.floor(col / 3) + (i % 3);
      if (board[boxRow][boxCol] === num) return false;
    }
    return true;
  };

  const emptySpot = findEmpty();
  if (!emptySpot) return true;

  const [row, col] = emptySpot;

  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;

      if (solveSudoku(board)) return true;

      board[row][col] = 0;
    }
  }

  return false;
};

// Generate a solved Sudoku board
const generateSolvedBoard = (): number[][] => {
  const board = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));

  // Fill the first row with shuffled digits
  const firstRow = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  board[0] = [...firstRow];

  // Solve the board to generate a valid Sudoku solution
  solveSudoku(board);
  return board;
};

// Remove cells based on difficulty
const removeCells = (board: number[][], difficulty: 'easy' | 'medium' | 'hard'): void => {
  const cellsToRemove = {
    easy: 30,
    medium: 40,
    hard: 50
  }[difficulty];

  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (board[row][col] !== 0) {
      board[row][col] = 0;
      removed++;
    }
  }
};

// Generate a puzzle with the specified difficulty
export const generatePuzzle = (difficulty: 'easy' | 'medium' | 'hard'): number[][] => {
  const board = generateSolvedBoard();
  removeCells(board, difficulty);
  return board;
};
