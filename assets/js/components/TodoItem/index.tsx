import { useMutation } from '@apollo/react-hooks';
import React, { useState } from 'react';

import { TOGGLE_TODO_ITEM, UPDATE_TODO_ITEM, DELETE_TODO_ITEM } from '../../gql/mutation';
import { GET_TODO_ITEMS } from '../../gql/query';

export function TodoListItem({ content, id, isCompleted }: TodoItem) {
  const [text, setText] = useState(content);

  const [toggleItem] = useMutation(TOGGLE_TODO_ITEM);
  const [updateItem] = useMutation(UPDATE_TODO_ITEM);
  const [deleteItem] = useMutation(DELETE_TODO_ITEM, {
    update(cache) {
      const { todoItems } = cache.readQuery<{ todoItems: TodoItem[] }>({ query: GET_TODO_ITEMS });
      cache.writeQuery({
        query: GET_TODO_ITEMS,
        data: { todoItems: todoItems.filter(item => item.id !== id) }
      });
    }
  });

  const updateOrDelete = () =>
    text.trim() !== content && (text.trim() === ''
      ? deleteItem({ variables: { id } })
      : updateItem({ variables: { id, content: text.trim() } }));

  return (
    <div className="todo_item">
      <button
        className={`todo_item__toggle ${isCompleted ? 'todo_item__toggle--completed' : ''}`}
        onClick={() => toggleItem({ variables: { id } })}
      />
      <input
        className="todo_item__content"
        value={text}
        onChange={e => setText(e.target.value)}
        onBlur={() => updateOrDelete()}
        onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}
      />
    </div>
  )
}