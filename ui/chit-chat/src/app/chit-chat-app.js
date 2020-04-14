import React from 'react';
import JoinChat from './join-chat.js';
import ChatRoom from './chat-room.js';

const STATUS = {
    NOT_CONNECTED: 'not-connected',
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
};

class ChitChatApp extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
          status: STATUS.NOT_CONNECTED,
          username: ''
      };
      this.handleJoinChatSubmit = this.handleJoinChatSubmit.bind(this);
    }

    render() {
        return (
          <div id="chit-chat-app">
             <JoinChat onClick={ () => this.handleJoinChatSubmit } />
             <ChatRoom chatName={ this.state.username } />
          </div>
        );
    }

    handleJoinChatSubmit() {
        let username = document.getElementById("chat-name").value;
        if (username === '') {
            alert('Name is empty');
            return;
        }
        this.setState({ status: STATUS.CONNECTING, username: username });
    }

 }

export default ChitChatApp;