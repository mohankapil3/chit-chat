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
            {
                this.state.status === STATUS.NOT_CONNECTED ?
                    <JoinChat
                        status={ this.state.status }
                        onJoinChat={ () => this.handleJoinChat }
                    />
                : null
            }

            {
                this.state.status !== STATUS.NOT_CONNECTED ?
                    <ChatRoom
                        status={ this.state.status }
                        chatName={ this.state.username }
                        messages={ this.state.messages }
                        onSendMessage={ () => this.handleSendMessage }
                    />
                : null
            }

          </div>
        );
    }

    handleJoinChat() {
        let username = document.getElementById("textbox-chat-name").value;
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
    }

    onStompClientMessageReceived(payload) {
        let message = payload.body;

        if (message) {
            var newMessage;
            if (message.indexOf('content') !== -1) {
                // its a chat message
                newMessage = JSON.parse(message);
            } else {
                // its a system message
                newMessage = {
                    sender: 'System',
                    content: message
                }
            }

            let currentMessages = this.state.messages;
            if (currentMessages.length > 5) {
              // Drop first item to create room for new item
              currentMessages = currentMessages.slice(1, currentMessages.length);
            }

            this.setState({ messages: currentMessages.concat(newMessage) });
        }
    }

    handleSendMessage() {
        let messageTextBox = document.getElementById("textbox-chat-message");
        let messageContent = messageTextBox.value;
        if (messageContent === '') {
            alert('Message is empty');
            return;
        }

        let message = {
            sender: this.state.username,
            content: messageContent
        };

        this.state.stompClient.send('/topic/chit-chat', {}, JSON.stringify(message));
        messageTextBox.value = '';
    }

 }

export default ChitChatApp;
