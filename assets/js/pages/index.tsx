import React, { useMemo } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';

import { HttpLink, } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client'

import HomePage from './home';

export function TodoApp() {
  const client = useMemo(() => {
    const link = new HttpLink({ uri: '/api' });

    return new ApolloClient({
      link,
      cache: new InMemoryCache({
        typePolicies: {
          Folder: {
            fields: {
              items: {
                merge(_existing, incoming) {
                  return incoming;
                }
              }
            }
          },
          Query: {
            fields: {
              folders: {
                merge(_existing, incoming) {
                  return incoming;
                }
              }
            }
          }
        }
      }),
    });
  }, []);


  return (
    <ApolloProvider client={client}>
      <HomePage />
    </ApolloProvider>
  );
}