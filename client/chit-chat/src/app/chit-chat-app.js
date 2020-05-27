import React from 'react';
import JoinChat from './join-chat.js';
import ChatRoom from './chat-room.js';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const STATUS = {
    NOT_CONNECTED: {
        text: 'Not connected',
        style: 'app-header__status-text--not-connected'
    },
    CONNECTING: {
        text: 'Connecting...',
        style: 'app-header__status-text--connecting'
    },
    CONNECTED: {
        text: 'Connected',
        style: 'app-header__status-text--connected'
    }
};

class ChitChatApp extends React.Component {

    constructor(props) {
      super(props);
      this.state = this.getInitialState();
      this.newMessageAlert = new Audio('/sounds/alert-1.mp3');
      this.windowInactiveAlert = new Audio('/sounds/alert-2.mp3');

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
                this.state.status.text === STATUS.NOT_CONNECTED.text ?
                    <JoinChat
                        status={ this.state.status }
                        onJoinChat={ () => this.handleJoinChat }
                    />
                : null
            }

            {
                this.state.status.text !== STATUS.NOT_CONNECTED.text ?
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

        let stompClient = Stomp.over(new SockJS('chit-chat'));
        stompClient.heartbeat.outgoing = 50000; // send heartbeat to server every 50sec
        stompClient.heartbeat.incoming = 50000; // expect heartbeat from server every 50sec
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

            // Play audio alert if chat window is not active or message from some other user
            if (!document.hasFocus()) {
                this.windowInactiveAlert.play();
            } else if (newMessage.sender !== this.state.username) {
                this.newMessageAlert.play();
            }
        }
    }

    handleSendMessage() {

        if (this.state.status.text !== STATUS.CONNECTED.text) {
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
