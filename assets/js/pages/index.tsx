import React, { useMemo } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';

import { HttpLink, } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client'

import { TodoList } from '../components/TodoList';

export function TodoApp() {
  const client = useMemo(() => {
    const link = new HttpLink({ uri: '/api' });

    return new ApolloClient({ link, cache: new InMemoryCache(), });
  }, []);


  return (
    <ApolloProvider client={client}>
      <TodoList />
    </ApolloProvider>
  );
}