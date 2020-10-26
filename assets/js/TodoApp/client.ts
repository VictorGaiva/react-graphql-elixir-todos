import ApolloClient, { InMemoryCache } from 'apollo-boost';

const client = new ApolloClient<InMemoryCache>({ uri: '/api' });

export default client;