import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { Component } from 'react'
import gql from 'graphql-tag';
import {Query} from 'react-apollo';



const HELLO_WORD = gql`
query hello_world {
  hello
}
`

class App extends Component {
  render (){
    return (
      <Query query={HELLO_WORD}>
      {({ loading, error, data, refetch }) => {
        if (loading) return <div>Fetching</div>
        if (error) return <div>error</div>
        return(
          <View style={styles.container}>
          <Text>{data.hello}</Text>
          <StatusBar style="auto" />
          </View>
        )
      }}
      </Query>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App