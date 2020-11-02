import React from 'react';

export function NewTodoButton({ onClick }: { onClick: () => void }) {
  return <button className="new_todo_button" onClick={onClick}>new todo item</button>
}