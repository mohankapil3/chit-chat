import React from 'react';
import JoinChat from './join-chat.js';
import ChatRoom from './chat-room.js';
import Stomp from 'stompjs';

const STATUS = {
    NOT_CONNECTED: 'Not connected',
    CONNECTING: 'Connecting...',
    CONNECTED: 'Connected',
};

class ChitChatApp extends React.Component {

    constructor(props) {
      super(props);
      this.state = this.getInitialState();

      this.handleJoinChat = this.handleJoinChat.bind(this);
      this.onStompClientConnected = this.onStompClientConnected.bind(this);
      this.onStompClientError = this.onStompClientError.bind(this);
      this.onStompClientMessageReceived = this.onStompClientMessageReceived.bind(this);
      this.handleSendMessage = this.handleSendMessage.bind(this);
      this.handleLogout = this.handleLogout.bind(this);
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
                        onDoLogout={ () => this.handleLogout }
                    />
                : null
            }
          </div>
        );
    }

    getInitialState() {
        return {
            status: STATUS.NOT_CONNECTED,
            username: '',
            stompClient: null,
            messages: []
        };
    }

    handleJoinChat() {
        let username = document.getElementById("textbox-chat-name").value;
        if (username === '') {
            alert('Name is empty');
            return;
        }

        this.setState({ username: username, status: STATUS.CONNECTING });

        let stompClient = Stomp.client('ws://' + window.location.host + '/chit-chat/websocket');
        stompClient.heartbeat.outgoing = 20000; // send heartbeat every 20sec to the server
        stompClient.heartbeat.incoming = 0; // not interested in heartbeat from the server
        stompClient.debug = () => {}; // suppressing console debug messages
        this.setState({ stompClient: stompClient });

        stompClient.connect({}, this.onStompClientConnected, this.onStompClientError);
    }

    onStompClientConnected() {
        console.log('Client connected');
        this.state.stompClient.subscribe('/topic/chit-chat'
                      , this.onStompClientMessageReceived, { 'chat-name': this.state.username });
        this.setState({ status: STATUS.CONNECTED });
    }

    onStompClientError(error) {
        console.log('Client connection error');
        console.log(error);
        alert('Unable to reach server, please join again');
        this.handleLogout();
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
              currentMessages = currentMessages.slice(0, currentMessages.length - 1);
            }

            this.setState({ messages: [newMessage, ...currentMessages] });
        }
    }

    handleSendMessage() {

        if (this.state.status !== STATUS.CONNECTED) {
            return;
        }

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

    handleLogout() {
        if (this.state.stompClient) {
            this.state.stompClient.disconnect({});
        }

        this.setState(this.getInitialState());
    }

 }

export default ChitChatApp;
