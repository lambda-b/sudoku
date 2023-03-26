import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bulma/css/bulma.css';
import '@/css/style.scss';
import Sudoku from '@/Sudoku';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Sudoku />
  </React.StrictMode>,
)
