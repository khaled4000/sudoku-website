import React, { useCallback, useState } from 'react';
import Cell from './Cell';
import { isValidBoard } from '../utils/validation';
import { generatePuzzle } from '../utils/sudokuGenerator';
import { solveSudoku } from '../utils/solver';
import './Grid.css';
import Tesseract from 'tesseract.js';
 import {toast} from "react-toastify"
 
const Grid: React.FC = () => {
  const [board, setBoard] = useState<number[][]>(Array.from({ length: 9 }, () => Array(9).fill(0)));
  const [validatonMessage, setValidationMessage] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingOCR, setLoadingOCR] = useState<boolean>(false);

  // Handle file upload for OCR
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
      processImage(file);
    }
  };

  // Process uploaded image using OCR
  const processImage = (file: File) => {
    setLoadingOCR(true);
    Tesseract.recognize(file, 'eng', { logger: (m) => console.log(m) })
      .then(({ data: { text } }) => {
        console.log('OCR Text:', text);
        const parsedBoard = parseOCRTextToBoard(text);
        setBoard(parsedBoard);
        setLoadingOCR(false);
      })
      .catch((error) => {
        console.error('OCR Error:', error);
        setLoadingOCR(false);
      });
  };

  // Parse OCR text into a Sudoku board
  const parseOCRTextToBoard = (text: string): number[][] => {
    const newBoard: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
    const lines = text
      .split('\n')
      .map((line) => line.replace(/[^0-9]/g, ''))
      .filter((line) => line.length > 0);

    lines.forEach((line, rowIndex) => {
      if (rowIndex < 9) {
        const numbers = line.split('').map((num) => parseInt(num, 10));
        for (let colIndex = 0; colIndex < 9; colIndex++) {
          newBoard[rowIndex][colIndex] = numbers[colIndex] || 0;
        }
      }
    });

    return newBoard;
  };

  // Handle changes in cell values
  const handleChange = (row: number, col: number, value: number) => {
    if (value >= 0 && value <= 9) {
      const newBoard = board.map((rowArr, i) =>
        rowArr.map((cell, j) => (i === row && j === col ? value : cell))
      );
      setBoard(newBoard);
      setValidationMessage(null);
    }
  };

  // Check if the current board is valid
  const handleCheckSolution = () => {
    const result = isValidBoard(board);
    setValidationMessage(result.message);
  };

  // Generate a new puzzle based on difficulty
  const handleGeneratePuzzle = () => {
    const newPuzzle = generatePuzzle(difficulty);
    setBoard(newPuzzle);
    setValidationMessage(null);
  };

  // Solve the current puzzle
  const handleSolvePuzzle =useCallback( () => {
    const solutionBoard = board.map((row) => [...row]); // Deep copy the board
    if (solveSudoku(solutionBoard)) {
      setBoard(solutionBoard); // Update the board with the solved puzzle
      setValidationMessage('Puzzle solved successfully!');
    } else {
      setValidationMessage('No solution exists for this puzzle.');
    }
  },[board]);
  





  const handleHint = () => {
    const solutionBoard = board.map((row) => [...row]); // Deep copy the board
    if (solveSudoku(solutionBoard)) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) { // Find the first empty cell
            const newBoard = board.map((row) => [...row]); // Deep copy the current board
            newBoard[row][col] = solutionBoard[row][col]; // Fill it with the correct value
            setBoard(newBoard); // Update the board state
            return;
          }
        }
      }
    } else {
      toast.warning('No solution available.');
    }
  };
  

  // Handle difficulty selection
  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDifficulty = e.target.value as 'easy' | 'medium' | 'hard';
    setDifficulty(selectedDifficulty);
    handleGeneratePuzzle();
  };

  return (
    <div>
      <div className="grid">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              value={cell}
              onChange={handleChange}
              isConflict={false} // Simplified conflict handling for now
            />
          ))
        )}
      </div>

      <div className="controls">
        <button onClick={handleGeneratePuzzle}>Generate Puzzle</button>
        <button onClick={handleCheckSolution}>Check Solution</button>
        <tr/>
        <button onClick={handleSolvePuzzle}>Solve</button>
        <button onClick={handleHint}>Hint</button>

        <div className="difficulty-selector">
          <label htmlFor="difficulty">Select Difficulty:</label>
          <select id="difficulty" value={difficulty} onChange={handleDifficultyChange}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="ocr-section">
        <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileUpload} />
        {imageUrl && <img src={imageUrl} 
        alt="Uploaded Sudoku Puzzle" 
        style={{ maxWidth: '300px', marginTop: '20px' }} 
        />
        }
        {loadingOCR && <p>Processing OCR...</p>}
      </div>

      {validatonMessage && <p>{validatonMessage}</p>} 


    </div>
  );
};

export default Grid;
