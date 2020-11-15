import React, { useState } from 'react';
import { useQuery } from "@apollo/react-hooks";

import { TodoListItem } from '../TodoItem';

import { NewTodoButton } from '../NewTodoButton';
import { NewTodoItem } from '../NewTodoItem';
import { GET_TODO_ITEMS } from '../../gql/query';

interface TodoItemsQueryResult {
  todoItems: TodoItem[];
}

export function TodoList() {
  const { data } = useQuery<TodoItemsQueryResult>(GET_TODO_ITEMS);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="todo_list">
      <h3 className="todo_list__header">Todo Items</h3>
      <div className="todo_list__list">
        {data?.todoItems.map(item =>
          <TodoListItem {...item} key={item.id} />
        )}
        {showForm && <NewTodoItem onClose={() => setShowForm(false)} />}
      </div>
      <div className="todo_list__spacer">
      </div>
      <footer className="todo_list__footer">
        <NewTodoButton onClick={() => setShowForm(true)} />
      </footer>
    </div>
  )
}