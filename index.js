import { registerRootComponent } from 'expo';
import { ApolloClient, InMemoryCache} from '@apollo/client';
import {ApolloProvider } from 'react-apollo'
import React, { Component } from 'react'
import { createHttpLink } from 'apollo-link-http'

import App from './App';

const httpLink = createHttpLink({
  uri: 'http://0.0.0.0:3003/graphql',
  credentials: 'include'
})


const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})


class AppContainer extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    );
  }
}



// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(AppContainer);

