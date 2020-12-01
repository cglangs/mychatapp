import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Homescreen'
import Login from './Login'
import Contacts from './Contacts'



const Stack = createStackNavigator();


class Navigation extends Component {
  render (){
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Welcome' }}
          />
          <Stack.Screen name="Contacts" component={Contacts} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}


export default Navigation