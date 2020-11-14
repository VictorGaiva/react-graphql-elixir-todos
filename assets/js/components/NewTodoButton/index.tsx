import React from 'react';

import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  newTodoButton: {
    color: "var(--primary)",
    border: "none",
    background: "none",
    font: '600 17px "Nunito", sans-serif',
    cursor: "pointer"
  }
})

export function NewTodoButton({ onClick }: { onClick: () => void }) {
  const { newTodoButton } = useStyles();

  return <button className={newTodoButton} onClick={onClick}>new todo item</button>
}