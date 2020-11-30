import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button} from 'react-native';
import React, { Component } from 'react'
import gql from 'graphql-tag';
import {Query, Mutation} from 'react-apollo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';



const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $user_name: String!, $role: String!) {
    CreateUser(email: $email, password: $password, user_name: $user_name, role: $role) {
      token
    }
  }
`

class Login extends Component {


  constructor(){
    super()
    this.state = {
      user_name: '',
      email: '',
      password: ''
    }
  }

  render (){
    const {email, password, user_name} = this.state
    return (
      <View  style={styles.container}>
      <Text>Login Page</Text>
      <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={text => this.setState({user_name: text})}
      value={this.state.user_name}
      />
      <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={text => this.setState({email: text})}
      value={this.state.email}
      />
      <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={text => this.setState({password: text})}
      value={this.state.password}
      />
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={{ email, password, user_name, role: "STUDENT"}}
        onCompleted={data => this._confirm(data)}
        onError={(error) => console.log(error.message)}
      >
        {(mutation, { loading, error }) => (
          <View>
          <Button
          title="Sign Up"
          onPress={() => mutation()
          } 
          />
          </View>
        )}
      </Mutation>
      </View>
    )
  }

   async _confirm(data) {
      var token = jwt_decode(data.CreateUser.token)
      const items = [['userId', token.userId], ['role', token.role]]
      await AsyncStorage.multiSet(items)
      this.props.navigation.navigate('Home', {user: {userId: token.userId, role:  token.role}})
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

export default Login