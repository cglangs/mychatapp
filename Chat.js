import React, { Component } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { Text} from 'react-native';

import io from "socket.io-client"
import {Query} from 'react-apollo';
import gql from 'graphql-tag';

const GET_CONVERSATION_QUERY = gql`
  query conversationQuery($userId: String!, $otherUserId: String!) {
    getConversation(userId: $userId, otherUserId: $otherUserId) {
	  	conversation_starter
	  	conversation_partner
	  	messages{
	  		text
	  	}
    }
  }
`


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
  	socket.emit('chat message',{message: msg, to: this.props.route.params.destination, from: this.props.route.params.user.userId})
  	this.setState(prevState => ({messages: GiftedChat.append(prevState.messages, msg)}))
  }

 
  render() {
    return (
     <Query query={GET_CONVERSATION_QUERY} variables={{userId: this.props.route.params.user.userId, otherUserId: this.props.route.params.destination}}>
      {({ loading, error, data, refetch }) => {
        if (loading) return <Text>Loading</Text>
        if (error) return <Text>Error</Text>
        return(
      <GiftedChat
      	onSend={msg => this.onSend(msg)}
        messages={this.state.messages}
        user={{_id: this.props.route.params.user.userId}}
      />
    );
     }}
    </Query>
    )
  }
}
export default Chat;