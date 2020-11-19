import { useMutation } from '@apollo/react-hooks';
import React, { useState } from 'react';

import { makeStyles } from '@material-ui/styles'

import { TOGGLE_TODO_ITEM, UPDATE_TODO_ITEM, DELETE_TODO_ITEM, CREATE_TODO_ITEM } from '../../gql/mutation';
import { GET_FOLDERS } from '../../gql/query';
import { InputProps } from '@material-ui/core';

const useStyles = makeStyles({
  todoItem: {
    display: "flex",
    position: "relative",
    lineHeight: "2.5",
    listStyle: "none"
  },
  todoItemContent: {
    border: "none",
    outline: "none",
    font: "inherit",
    width: "100%",
    margin: "0 0 0 3rem",
    borderBottom: "1px solid #eee"
  },
  todoItemToggle: {
    position: "absolute",
    height: "1.2rem",
    width: "1.2rem",
    border: "1px solid #aaa",
    borderRadius: "50%",
    background: "transparent",
    left: "1em",
    top: "50%",
    transform: "translateY(-50%)",
  },
  todoItemToggleCompleted: {
    background: "rgb(0, 122, 225)",
    "&::after": {
      position: "absolute",
      content: '',
      top: "1px",
      left: "1px",
      borderRadius: "50%",
      right: "1px",
      bottom: "1px",
      border: "1px solid white"
    }
  }
});

export default function TodoListItem({ item, onClose, folderId }: { folderId: string; item?: TodoItem, onClose?: () => void }) {
  const { todoItem, todoItemContent, todoItemToggle, todoItemToggleCompleted } = useStyles();
  const [text, setText] = useState(item?.content ?? '');

  const [toggleItem] = useMutation(TOGGLE_TODO_ITEM);
  const [updateItem] = useMutation(UPDATE_TODO_ITEM);

  const [deleteItem] = useMutation(DELETE_TODO_ITEM, {
    update(cache) {
      const data = cache.readQuery<{ folders: Folder[] }>({ query: GET_FOLDERS });
      cache.writeQuery({
        query: GET_FOLDERS,
        data: {
          ...data,
          folders: data.folders.map(
            f => f.id === folderId ? { ...f, items: f.items.filter(({ id }) => id !== item.id) } : f
          )
        }
      });
    }
  });

  const [createTodoItem] = useMutation<{ createTodoItem: TodoItem }>(CREATE_TODO_ITEM, {
    update(cache, { data: { createTodoItem: newTodo } }) {
      const data = cache.readQuery<{ folders: Folder[] }>({ query: GET_FOLDERS });
      cache.writeQuery({
        query: GET_FOLDERS,
        data: {
          ...data,
          folders: data.folders.map(f => f.id === folderId ? { ...f, items: [...f.items, newTodo] } : f)
        }
      });
    }
  });

  function handleBlur(e: Parameters<InputProps['onBlur']>[0]) {
    if (item) {
      if (text.trim() !== item?.content && (text.trim() === ''))
        deleteItem({ variables: { id: item?.id } })
      else
        updateItem({ variables: { id: item?.id, content: text.trim() } })
    } else {
      if (text.trim() === "")
        onClose()
      else {
        createTodoItem({ variables: { content: text.trim() } }).then(onClose)
      }
    }
  }

  function handleKeyDown(e: Parameters<InputProps['onKeyDown']>[0]) {
    if (e.key === 'Enter') {
      if (item) {
        e.currentTarget.blur()
      } else {
        if (text.trim() === "")
          onClose()
        else
          createTodoItem({ variables: { content: text.trim(), folderId } }).then(() => setText(''))
      }
    }
  }

  return (
    <div className={todoItem}>
      <button
        className={`${todoItemToggle} ${item?.isCompleted ? todoItemToggleCompleted : ''}`}
        onClick={() => toggleItem({ variables: { id: item?.id } })}
      />
      <input
        className={todoItemContent}
        value={text}
        onChange={e => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus={!item}
      />
    </div>
  )
}