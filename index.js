import { registerRootComponent } from 'expo';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import React from 'react';


import App from './App';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'localhost:4000/graphql',
  cache: new InMemoryCache()
});

const rootComp = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately

registerRootComponent(rootComp);
