import '@/css/style.scss';
import Sudoku from '@/Sudoku';
import 'bulma/css/bulma.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Sudoku />
  </React.StrictMode>,
)
