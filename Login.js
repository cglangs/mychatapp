import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button} from 'react-native';
import React, { Component } from 'react'
import gql from 'graphql-tag';
import {Query, Mutation} from 'react-apollo';
/*
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

*/


const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $user_name: String!, $role: String!) {
    CreateUser(email: $email, password: $password, user_name: $user_name, role: $role) {
      user{
        user_name
        email
        password
        role
      }
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

   _confirm(data) {
    console.log(data)
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