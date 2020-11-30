 import AsyncStorage from '@react-native-async-storage/async-storage';

 export async function isLoggedIn(){
  const loggedIn = await AsyncStorage.getItem('userId')
  return loggedIn
 }


  export async function logoutUser(){
    await AsyncStorage.multiRemove(['userId', 'role'])
  }