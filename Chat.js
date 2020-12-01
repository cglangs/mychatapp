import React, { Component } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import io from "socket.io-client"



const socket = io("http://localhost:3001/", {
  reconnectionDelayMax: 10000
});


socket.on('chat message', function(msg){
    console.log("Recieved message:", msg)
})

class Chat extends React.Component {

 constructor(){
    super()
    this.state = {
    	messages: []
    }
  }

  componentDidMount(){
  	socket.emit('registration', this.props.route.params.user.userId)
  	socket.on('chat message', function(msg){
  		this.setState(prevState => ({
  			messages: GiftedChat.append(prevState.messages, msg)
		}))
	}.bind(this))
  }

  onSend(msg) {
  	socket.emit('chat message',msg)
  }

 
  render() {
    return (
      <GiftedChat
      	onSend={msg => this.onSend(msg)}
        messages={this.state.messages}
      />
    );
  }
}
export default Chat;