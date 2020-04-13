import React from 'react';
import './join-chat.css';
import ChatHeader from './chat-header.js';

class JoinChat extends React.Component {
  render() {
      return (
        <div id="join-chat-dialogue" className="dialogue">
            <ChatHeader/>
            <label>Enter name</label>
            <input type="text" id="chat-name" />
            <button onClick={ this.props.onClick() }>
              Join room
            </button>
        </div>
      );
  }
}

export default JoinChat;
