import React from 'react';
import JoinChat from './join-chat.js';
import ChatRoom from './chat-room.js';
import Stomp from 'stompjs';

const STATUS = {
    NOT_CONNECTED: 'Not connected',
    CONNECTING: 'Connecting',
    CONNECTED: 'Connected',
};

class ChitChatApp extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
          status: STATUS.NOT_CONNECTED,
          username: '',
          stompClient: null,
          messages: []
      };

      this.handleJoinChat = this.handleJoinChat.bind(this);
      this.onStompClientConnected = this.onStompClientConnected.bind(this);
      this.onStompClientError = this.onStompClientError.bind(this);
      this.onStompClientMessageReceived = this.onStompClientMessageReceived.bind(this);
      this.handleSendMessage = this.handleSendMessage.bind(this);
    }

    render() {
        return (
          <div id="chit-chat-app">
             <JoinChat status={ this.state.status } onJoinChat={ () => this.handleJoinChat } />
             <ChatRoom
                 status={ this.state.status }
                 chatName={ this.state.username }
                 messages={ this.state.messages }
                 onSendMessage={ () => this.handleSendMessage }
              />
          </div>
        );
    }

    handleJoinChat() {
        let username = document.getElementById("chat-name").value;
        if (username === '') {
            alert('Name is empty');
            return;
        }

        this.setState({ username: username, status: STATUS.CONNECTING });

        let stompClient = Stomp.client('ws://localhost:8080/chit-chat/websocket');
        stompClient.heartbeat.outgoing = 20000; // send heartbeat every 20sec to the server
        stompClient.heartbeat.incoming = 0; // not interested in heartbeat from the server
        this.setState({ stompClient: stompClient });

        stompClient.connect({}, this.onStompClientConnected, this.onStompClientError);
    }

    onStompClientConnected() {
        console.log('Stomp client connected');
        this.state.stompClient.subscribe('/topic/chit-chat', this.onStompClientMessageReceived);
        this.setState({ status: STATUS.CONNECTED });
    }

    onStompClientError(error) {
        console.log('Stomp client connection error');
        console.log(error);
        // TODO retry?
    }

    onStompClientMessageReceived(payload) {
        console.log('Message received from server');
        let message = JSON.parse(payload.body);
        console.log('Message - ' + message);
        // TODO concatenate to messages array
    }

    handleSendMessage(message) {
        console.log('Sending message to server');
        this.state.stompClient.send('/topic/chit-chat', {}, message);
    }

 }

export default ChitChatApp;
