import React from 'react';
import JoinChat from './join-chat.js';

class ChitChatApp extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
          // status could be - 'not-connected' or 'connected', how do we make enum?
          status: 'not-connected',
          username: ''
      };
      this.handleJoinChatSubmit = this.handleJoinChatSubmit.bind(this);
    }

    render() {
        return (
          <div id="chit-chat-app">
             <JoinChat onClick={ () => this.handleJoinChatSubmit } />
          </div>
        );
    }

    handleJoinChatSubmit() {
        let username = document.getElementById("chat-name").value;
        if (username === '') {
            alert('Name is empty');
            return;
        }
        this.setState({ username: username });
    }

 }

export default ChitChatApp;