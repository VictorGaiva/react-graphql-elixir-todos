import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import React, { useState } from 'react'
import TodoItem from './TodoItem';
import { GET_TODO_ITEMS } from './TodoList';

const CREATE_TODO_ITEM = gql`
  mutation new_item($content: String!){
    createTodoItem(content: $content){
      id isCompleted content
    }
  }
`;

export function NewTodoForm({ onClose }: { onClose: () => void }) {
  const [content, setContent] = useState('');
  const [createTodoItem] = useMutation(CREATE_TODO_ITEM, {
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
