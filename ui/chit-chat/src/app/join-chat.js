import React from 'react';
import './join-chat.css';
import ChatHeader from './chat-header.js';

export default function JoinChat(props) {
    return (
        <div id="join-chat-dialogue" className="dialogue">
            <ChatHeader/>
            <label>Enter name</label>
            <input type="text" id="chat-name" maxLength="10" />
            <button onClick={ props.onClick() }>
              Join room
            </button>
        </div>
    );

}
