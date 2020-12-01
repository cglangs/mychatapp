import React, { Component } from 'react'
import { FlatList, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';

const GET_CONTACTS_QUERY = gql`
  query contactsQuery($userId: String!) {
    getContacts(userId: $userId) {
      _id
      user_name
    }
  }
`


class Contacts extends Component {


  render (){
    return (
      <Query query={GET_CONTACTS_QUERY} variables={{userId: this.props.route.params.user.userId}}>
      {({ loading, error, data, refetch }) => {
        if (loading) return <Text>Loading</Text>
        if (error) return <Text>Error</Text>
        return(
          <FlatList
            data={data.getContacts}
            renderItem={({ item, index, separators }) => (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Chat', {user: this.props.route.params.user})} style={styles.item}>
              <Text style={styles.title}>{item.user_name}</Text>
            </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
          />
        )

      }}
      </Query>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default Contacts