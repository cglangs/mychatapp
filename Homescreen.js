import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button  } from 'react-native';
import React, { Component } from 'react'
//import gql from 'graphql-tag';
//import {Query} from 'react-apollo';

/*const HELLO_WORD = gql`
query hello_world {
  hello
}
`*/

class HomeScreen extends Component {

  render (){
    return (
      <View  style={styles.container}>
      <Button
        title="Go to Login Page"
        onPress={() =>
        this.props.navigation.navigate('Login')
        } 
      />

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
