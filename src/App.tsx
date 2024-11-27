import React from 'react';
import './App.css';
import Grid from './components/Grid';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; //lal fildet bl ToastContainer
const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Sudoku Game</h1>
      <Grid/> 
      <ToastContainer
        position="top-right" //el default hek
        autoClose={5500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover //el default hek
      />      
    </div>
  );
};

export default App;






