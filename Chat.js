import React, { Component } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import io from "socket.io-client"



const socket = io("http://localhost:3001/", {
  reconnectionDelayMax: 10000
});


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
  			messages: GiftedChat.append(prevState.messages, msg.message)
		}))
	}.bind(this))
  }

  onSend(msg) {
  	console.log(msg)
  	socket.emit('chat message',{message: msg, to: this.props.route.params.destination, from: this.props.route.params.user.userId})
  	this.setState(prevState => ({messages: GiftedChat.append(prevState.messages, msg)}))
  }

 
  render() {
    return (
      <GiftedChat
      	onSend={msg => this.onSend(msg)}
        messages={this.state.messages}
        user={{_id: this.props.route.params.user.userId}}
      />
    );
  }
}
export default Chat;