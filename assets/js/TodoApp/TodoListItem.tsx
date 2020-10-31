import { gql, useMutation } from '@apollo/react-hooks';
import React, { ChangeEvent, useCallback, useState } from 'react';
import TodoItem from './TodoItem';
import { GET_TODO_ITEMS } from './TodoList';

const TOGGLE_TODO_ITEM = gql`
  mutation toggle($id:ID!){
    toggleTodoItem(id:$id) { id isCompleted }
  }
`;

const UPDATE_TODO_ITEM = gql`
  mutation update($id:ID! $content: String!){
    updateTodoItem(content:$content, id:$id){ id content }
  }
`;

const DELETE_TODO_ITEM = gql`
  mutation delete($id:ID!){
    deleteTodoItem(id:$id)
  }
`;

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

  const handleToggle = useCallback(() => toggleItem({ variables: { id } }), [id, toggleItem]);
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setText(e.target.value), [setText]);
  const onBlur = useCallback(() => {
    if (text === '') {
      deleteItem({ variables: { id } });
      return;
    }
    if (text === content) return;

    updateItem({ variables: { id, content: text } })
  }, [text, updateItem]);

  return (
    <div className="todo_item">
      <button className={`todo_item__toggle ${isCompleted ? 'todo_item__toggle--completed' : ''}`} onClick={handleToggle} />
      <input className="todo_item__content" value={text} onChange={onChange} onBlur={onBlur} />
    </div>
  )
}