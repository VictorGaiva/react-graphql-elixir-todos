import "../css/app.sass";

import React from "react";
import ReactDOM from "react-dom";
import { TodoApp } from "./pages";
import { BrowserRouter } from "react-router-dom";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("TodoApp");
  if (!container) return;

  ReactDOM.render(
    <BrowserRouter>
      <TodoApp />
    </BrowserRouter>,
    container
  );
});
