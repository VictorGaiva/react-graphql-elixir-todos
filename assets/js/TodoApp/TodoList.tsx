import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from "@apollo/react-hooks";

import TodoItem from './TodoItem';
import { TodoListItem } from './TodoListItem';

interface TodoItemsQueryResult {
  todoItems: TodoItem[];
}

export const GET_TODO_ITEMS = gql`
  { todoItems { id content isCompleted } }
`;

export function TodoList() {
  const { data } = useQuery<TodoItemsQueryResult>(GET_TODO_ITEMS);

  return (
    <div className="todo_list">
      <h3 className="todo_list__header">Todo Items</h3>
      <div className="todo_list__list">
        {data?.todoItems.map(item =>
          <TodoListItem {...item} key={item.id} />
        )}
      </div>
    </div>
  )
}