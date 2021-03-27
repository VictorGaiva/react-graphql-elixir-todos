import React, { useEffect, useState } from "react";

import {
  HttpLink,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  NormalizedCacheObject,
  split,
  from, ApolloLink
} from "@apollo/client";
import { Switch, Redirect, Route, useHistory } from "react-router-dom";
import decode from "jwt-decode";

import HomePage from "./home";

import LoginPage from "./login";
import SignupPage from "./sign-up";
import { AbsintheLink } from "catuaba";
import { getMainDefinition } from "@apollo/client/utilities";

export function TodoApp() {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | null>(null);
  const history = useHistory();

  function login(token?: string) {
    // Token exists
    if (token) localStorage.setItem("auth-token", token);
    else if (!localStorage.getItem("auth-token")) return;

    // Token is valid
    const { exp } = decode(localStorage.getItem("auth-token")) as {
      exp: number;
    };
    if (Date.now() > exp * 1000) {
      localStorage.removeItem("auth-token");
      return;
    }

    const auth = new ApolloLink((operation, forward) => {
      operation.setContext(({ headers }) => ({
        headers: {
          authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          ...headers,
        },
      }));
      return forward(operation);
    });

    const http = new HttpLink({ uri: "/api" });

    const absintheLink = new AbsintheLink("ws://localhost:4000/socket/websocket?vsn=2.0.0");

    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      absintheLink,
      http,
    );

    const link = from([auth, splitLink]);

    setClient(
      new ApolloClient({
        link,
        cache: new InMemoryCache({
          typePolicies: {
            Folder: {
              fields: {
                items: {
                  merge(_existing, incoming) {
                    return incoming;
                  },
                },
              },
            },
            User: {
              fields: {
                folders: {
                  merge(_existing, incoming) {
                    return incoming;
                  },
                },
              },
            },
          },
        }),
      })
    );
    history.push("/home");
  }
  useEffect(login, []);

  return (
    <Switch>
      <Route path="/login">
        <LoginPage onLogin={login} />
      </Route>
      <Route path="/sign-up">
        <SignupPage onLogin={login} />
      </Route>
      <Route path="/home">
        {client ? (
          <ApolloProvider client={client}>
            <HomePage logout={() => (localStorage.removeItem("auth-token"), setClient(null))} />
          </ApolloProvider>
        ) : (
          <Redirect to={"/login"} />
        )}
      </Route>
      <Route path="/">
        <Redirect to={client ? "/home" : "/login"} />
      </Route>
    </Switch>
  );
}

