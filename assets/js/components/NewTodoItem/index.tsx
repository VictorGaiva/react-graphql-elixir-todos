import { useMutation } from '@apollo/react-hooks';
import React, { useState } from 'react'
import { CREATE_TODO_ITEM } from '../../gql/mutation';
import { GET_TODO_ITEMS } from '../../gql/query';

export function NewTodoItem({ onClose }: { onClose: () => void }) {
  const [content, setContent] = useState('');
  const [createTodoItem] = useMutation<{ createTodoItem: TodoItem }>(CREATE_TODO_ITEM, {
    update(cache, { data: { createTodoItem: newTodo } }) {
      const { todoItems } = cache.readQuery<{ todoItems: TodoItem[] }>({ query: GET_TODO_ITEMS });
      cache.writeQuery({
        query: GET_TODO_ITEMS,
        data: { todoItems: [...todoItems, newTodo] }
      });
    }
  });

  return (
    <div className="todo_item new_todo_form" >
      <button className="todo_item__toggle" disabled></button>
      <input
        value={content}
        onChange={e => setContent(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && (
          content.trim() === ""
            ? onClose()
            : createTodoItem({ variables: { content: content.trim() } }).then(() => setContent(''))
        )}
        onBlur={() => content.trim() === ""
          ? onClose()
          : createTodoItem({ variables: { content: content.trim() } }).then(onClose)}
        type="text"
        className="todo_item__content"
        autoFocus
      />
    </div>
  )
}
