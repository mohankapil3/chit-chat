import React from 'react';
import './common.css';
import './chat-room.css';
import ChatHeader from './chat-header.js';

function ChatMessage(props) {
    return (
        <p>
            <strong>{props.sender}</strong> <em>{props.content}</em>
        </p>
    );
}

function ChatInput(props) {
    return (
        <div>
             <input type="text" id="textbox-chat-message" placeholder="Enter message..." maxLength="100" />
             <button onClick={ props.onSendMessage() }>
                 Send
             </button>
        </div>
    );
}

export default function ChatRoom(props) {
    return (
        <div id="chat-room-dialogue" className="chit-chat__dialogue chat-room">
            <ChatHeader status={ props.status }/>
            <label>Chat name - { props.chatName }</label>
            <ChatInput onSendMessage={ props.onSendMessage } />
            {
                props.messages.map((message, index) =>
                      <ChatMessage
                        key={index}
                        sender={message.sender}
                        content={message.content}
                      />,
                 )
            }
        </div>
    );
}

