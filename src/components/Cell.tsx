import React, { memo } from 'react';
import './Cell.css';

interface CellProps {
  row: number; //use for the function in /utils
  col: number;
  value: number;
  onChange: (row: number, col: number, value: number) => void;
  isConflict ?: boolean;
 
}
      //send the  cell interface like a prop 
const Cell: React.FC<CellProps> = ({ row, col, value, onChange, isConflict }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    onChange(row, col, newValue);
  };
  
  return (
    <input
      type="text"
      value={value !== 0 ? value : ''}
      onChange={handleChange}
      className={`cell ${isConflict ? 'conflict' : ''}`}
    />
  );
};

export default memo(Cell);
   //useMemo hook 