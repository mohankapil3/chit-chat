import React from 'react';
import './common.css';
import './chat-room.css';
import ChatHeader from './chat-header.js';

class ChatRoom extends React.Component {

/*
  constructor(props) {
      super(props);
  }
  */

  render() {
      return (
         <div id="chat-room-dialogue" className="chit-chat__dialogue chat-room">
             <ChatHeader status={ this.props.status }/>
             <label>Chat name - { this.props.chatName }</label>
         </div>
      );
  }

}

export default ChatRoom
