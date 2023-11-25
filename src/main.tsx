import Sudoku from '@/Sudoku';
import '@/css/style.scss';
import 'bulma/css/bulma.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <Sudoku />
    </RecoilRoot>
  </React.StrictMode>,
)
