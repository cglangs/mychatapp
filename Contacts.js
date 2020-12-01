import React, { Component } from 'react'
import { Text, View} from 'react-native';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';





const GET_CONTACTS_QUERY = gql`
  query contactsQuery($userId: String!) {
    getContacts(userId: $userId) {
      user_name
    }
  }
`


class Contacts extends Component {
  render (){
    console.log(this.props.route.params)
    return (
      <Query query={GET_CONTACTS_QUERY} variables={{userId: this.props.route.params.user.userId}}>
      {({ loading, error, data, refetch }) => {
        if (loading) return <Text>Loading</Text>
        if (error) return <Text>Error</Text>
        return(
          <View/>
        )

      }}
      </Query>
    );
  }
}


export default Contacts