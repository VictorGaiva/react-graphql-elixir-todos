import "../css/app.sass"

import React from 'react';
import ReactDOM from 'react-dom';
import { TodoApp } from './pages';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('TodoApp');
  if (!container) return;

  ReactDOM.render(<TodoApp />, container);

})