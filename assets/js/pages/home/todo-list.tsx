import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { Button } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";

import TodoListItem from "./todo-item";

const useStyles = makeStyles({
  todoListContent: {
    margin: "0",
    padding: "2rem 0 2rem 2rem",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
  todoListHeader: {
    fontFamily: '"Nunito", sans-serif',
    fontWeight: 800,
    fontSize: "31px",
    margin: "0",
    color: "rgb(0, 122, 225)",
  },
  todoListFooter: {
    borderTop: "1px solid #eee",
    padding: "2rem 0 2rem 2rem",
  },
  todoListContainer: {
    display: "grid",
    gridTemplateRows: "1fr auto",
  },
});

export function TodoList({ folder }: { folder: Folder }) {
  const [showNewTodo, setShowNewTodo] = useState(false);
  const {
    todoListContainer,
    todoListHeader,
    todoListContent,
    todoListFooter,
  } = useStyles();

  return (
    <div className={todoListContainer}>
      <div className={todoListContent}>
        <h3 className={todoListHeader}>{folder?.name ?? "Select a folder"}</h3>
        <div style={{ margin: 0 }}>
          {folder?.items.map((item) => (
            <TodoListItem folderId={folder.id} item={item} key={item.id} />
          ))}
          {showNewTodo && (
            <TodoListItem
              folderId={folder.id}
              onClose={() => setShowNewTodo(false)}
            />
          )}
        </div>
        <div style={{ flex: 1 }}></div>
      </div>

      <div className={todoListFooter}>
        <Button
          disabled={!folder}
          onClick={() => setShowNewTodo(true)}
          endIcon={<AddIcon />}
          variant="contained"
          color="primary"
        >
          new todo
        </Button>
      </div>
    </div>
  );
}
