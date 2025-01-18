import Sudoku from "@/Sudoku";
import "@/css/style.scss";
import "bulma/css/bulma.css";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Sudoku />
  </React.StrictMode>
);
