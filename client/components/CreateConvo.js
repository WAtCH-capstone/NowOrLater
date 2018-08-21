import React, { Component } from 'react';
import {
  Container,
  Form,
  Input,
  Item,
  Button,
  Label,
  Text,
  Separator,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
} from 'native-base';
import db from '../../firestore';
import firebase from 'firebase';

// Need to have a way to check if that conversation already exists

export default class CreateConvo extends Component {
  constructor(props) {
    super(props);
    this.state = { friends: [], recipients: [], userDoc: {}, userRef: '' };
    this.createNewConvo = this.createNewConvo.bind(this);
  }

  async componentDidMount() {
    const uid = await firebase.auth().currentUser.uid;
    const userData = await this.getUserDoc(uid);
    const friends = await this.getFriends(userData.friends);
    this.setState({
      userDoc: userData,
      userRef: firebase.auth().currentUser,
      friends,
    });
  }

  async getUserDoc(id) {
    const snapshot = await db
      .collection('users')
      .doc(id)
      .get();
    const userData = await snapshot.data();
    return userData;
  }

  async getFriends(friendArr) {
    let friends = [];
    for (let id of friendArr) {
      const user = await db
        .collection('users')
        .doc(id)
        .get();
      const data = await user.data();
      const objToAdd = { id, data };
      friends.push(objToAdd);
    }
    return friends;
  }

  async createNewConvo(recipientArr) {
    // grab .data.email for each (each el has friend data)
    const recipientQuery = await db
      .collection('users')
      .where('email', '==', recipientEmail)
      .get();
    const recArr = recipientQuery.docs.map(doc => doc.data());
    const recipient = recArr[0];
    const recipientId = recipientQuery.docs[0].id;
    const currUserId = await firebase.auth().currentUser.uid;
    const currUserRef = db.collection('users').doc(currUserId);
    const recipientRef = db.collection('users').doc(recipientId);
    db.collection('conversations')
      .add({
        users: [currUserId, recipientId],
      })
      .then(docRef => {
        currUserRef.update({
          conversations: firebase.firestore.FieldValue.arrayUnion(docRef.id),
        });
        recipientRef.update({
          conversations: [...recipient.conversations, docRef.id],
        });
        return docRef.id;
      })
      .then(id =>
        this.props.navigation.navigate('SingleConvo', {
          id,
          friend: recipient,
        })
      )
      .catch(err => console.error(err));
  }

  async sendFriendRequest(email) {
    const currUserId = await firebase.auth().currentUser.uid;
    const friendQuery = await db
      .collection('users')
      .where('email', '==', email)
      .get();
    const friendArr = friendQuery.docs.map(friend => friend.data());
    const friend = friendArr[0];
    console.log(friend);
    const friendRef = db.collection('users').doc(friendQuery.docs[0].id);
    friendRef.set(
      { requests: [...friend.requests, currUserId] },
      { merge: true }
    );
    alert('Friend request sent!');
  }

  addToConvo(friend, index) {
    this.setState(prevState => {
      prevState.friends.splice(index, 1);
      return {
        friends: prevState.friends,
        recipients: [...prevState.recipients, friend],
      };
    });
  }

  removeFromConvo(friend, index) {
    this.setState(prevState => {
      prevState.recipients.splice(index, 1);
      return {
        recipients: prevState.recipients,
        friends: [...prevState.friends, friend],
      };
    });
  }

  renderRecipients() {
    console.log(this.state.recipients);
    return this.state.recipients.map((friend, index) => {
      return (
        <ListItem key={friend.id}>
          <Left>
            <Thumbnail source={{ uri: friend.data.icon }} />
          </Left>
          <Body>
            <Text>{friend.data.displayName}</Text>
          </Body>
          <Right>
            <Button onPress={() => this.removeFromConvo(friend, index)}>
              <Text>Remove</Text>
            </Button>
          </Right>
        </ListItem>
      );
    });
  }

  renderFriends() {
    return this.state.friends.map((friend, index) => {
      return (
        <ListItem key={friend.id}>
          <Left>
            <Thumbnail source={{ uri: friend.data.icon }} />
          </Left>
          <Body>
            <Text>{friend.data.displayName}</Text>
          </Body>
          <Right>
            <Button onPress={() => this.addToConvo(friend, index)}>
              <Text>Add</Text>
            </Button>
          </Right>
        </ListItem>
      );
    });
  }

  render() {
    return (
      <Container>
        <Content>
          <Separator bordered>
            <Text>Recipients</Text>
          </Separator>
          {this.state.recipients.length ? (
            <List>{this.renderRecipients()}</List>
          ) : (
            <Text>No friends added.</Text>
          )}
          <Button
            style={{ marginTop: 10 }}
            full
            rounded
            primary
            onPress={() => {
              this.createNewConvo(this.state.recipients);
            }}
          >
            <Text style={{ color: 'white' }}>Start Conversation</Text>
          </Button>
          <Separator bordered>
            <Text>Friends</Text>
          </Separator>
          {this.state.friends.length ? (
            <List>{this.renderFriends()}</List>
          ) : (
            <Text>
              You have no friends yet. :( Press "Add Friend" to start adding
              friends!
            </Text>
          )}
          <Form>
            <Item floatingLabel>
              <Label>Recipient E-mail</Label>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                clearButtonMode="always"
                onChangeText={email => this.setState({ email })}
              />
            </Item>
            <Button
              style={{ marginTop: 10 }}
              full
              rounded
              primary
              onPress={() => {
                this.sendFriendRequest(this.state.email);
              }}
            >
              <Text style={{ color: 'white' }}>Add Friend</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}
