import React from 'react';
import client from './client';
import { ApolloProvider } from '@apollo/react-hooks';
import { TodoList } from './TodoList';

export function TodoApp() {

  return (
    <ApolloProvider client={client}>
      <TodoList />
    </ApolloProvider>
  );
}