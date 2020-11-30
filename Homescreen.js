import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button  } from 'react-native';
import React, { Component } from 'react'
 import AsyncStorage from '@react-native-async-storage/async-storage';
//import {isLoggedIn, logoutUser} from './utils'



class HomeScreen extends Component {

  constructor(){
    super()
    this.baseState = {
      user: {
        userId: '',
        role: ''
      }
    }
    this.state = this.baseState

  }

  componentDidUpdate(prevProps, prevState){
    if(!this.state.user.userId && !prevState.user.userId && this.props.route.params){
      this.setUser(this.props.route.params.user)
    }
  }

  async logoutUser(){
    await AsyncStorage.multiRemove(['userId', 'role'])
    this.setState(this.baseState)
  }

  async setUser() {
    const role = await AsyncStorage.getItem('role')
    const userId = await AsyncStorage.getItem('userId')
    this.setState({user:{userId, role}})
  }

  componentDidMount(){
    this.setUser()
  }

  render (){
    return (
      <View  style={styles.container}>
      <Button
        title={this.state.user.userId ? "Logout" : "Login"}
        onPress={() =>{this.state.user.userId ? this.logoutUser() : this.props.navigation.navigate('Login')}} 
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
