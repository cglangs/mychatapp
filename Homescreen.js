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

class HomeScreen extends Component {

  render (){
    return (
      <View  style={styles.container}>
      <Query query={HELLO_WORD}>
        {({ loading, error, data, refetch }) => {
        if (loading) return <Text>Fetching</Text>
        if (error) return <Text>error</Text>
        return(
          <View>
          <Text>{data.hello}</Text>
          </View>
        )
      }}
      </Query>
      </View>
    )
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

export default HomeScreen
