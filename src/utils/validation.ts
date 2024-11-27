import { toast } from 'react-toastify';

// Function to check if the entire board is valid and complete
export const isValidBoard = (board: number[][]): { isValid: boolean; message: string } => {
  // Loop through rows, columns, and 3x3 boxes to check validity
  for (let i = 0; i < 9; i++) {
    // Check each row, column, and 3x3 box for validity
    if (!isValidRow(board, i)) {
      toast.error(`Row ${i + 1} is invalid.`);
      return { isValid: false, message: `Row ${i + 1} is invalid.` };
    }
    if (!isValidCol(board, i)) {
      toast.error(`Column ${i + 1} is invalid.`);
      return { isValid: false, message: `Column ${i + 1} is invalid.` };
    }
    if (!isValidBox(board, i)) {
      toast.error(`3x3 box ${i + 1} is invalid.`);
      return { isValid: false, message: `3x3 box ${i + 1} is invalid.` };
    }
  }

  // Check if the board is complete (no empty cells)
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        toast.error("The board is incomplete.");
        return { isValid: false, message: "The board is incomplete." };
      }
    }
  }

  // If valid and complete, show success toast and clear the board
  toast.success("The board is valid and complete.");

  // Clear the board (set all values to 0 or null)
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      board[row][col] = 0; // or null, depending on your logic
    }
  }

  
  return { isValid: true, message: "The board is valid and complete." };
};



// Function to check if a specific row is valid
export const isValidRow = (board: number[][], row: number): boolean => {
  const seen = new Set<number>();
  for (let col = 0; col < 9; col++) {
    const value = board[row][col];
    if (value !== 0 && seen.has(value)) return false;
    seen.add(value);
  }
  return true;
};

// Function to check if a specific column is valid
export const isValidCol = (board: number[][], col: number): boolean => {
  const seen = new Set<number>();
  for (let row = 0; row < 9; row++) {
    const value = board[row][col];
    if (value !== 0 && seen.has(value)) return false;
    seen.add(value);
  }
  return true;
};

// Function to check if a specific 3x3 box is valid
export const isValidBox = (board: number[][], boxIndex: number): boolean => {
  const seen = new Set<number>();
  const startRow = Math.floor(boxIndex / 3) * 3;
  const startCol = (boxIndex % 3) * 3;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const value = board[startRow + row][startCol + col];
      if (value !== 0 && seen.has(value)) return false;
      seen.add(value);
    }
  }
  return true;
};
