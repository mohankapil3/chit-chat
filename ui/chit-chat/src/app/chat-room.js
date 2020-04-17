import React, { useEffect } from 'react';
import './common.css';
import './chat-room.css';
import ChatHeader from './chat-header.js';

function ChatMessage(props) {
    return (
        <p>
            <strong>{props.sender}:</strong> {props.content}
        </p>
    );
}

function ChatInput(props) {
    useEffect(() => {
        document.getElementById('textbox-chat-message').onkeypress = function(e) {
            if(e.keyCode === 13) { // 'Enter' key
                document.getElementById('button-send-message').click();
            }
        }
    }, []);

    return (
        <div>
             <input type="text" id="textbox-chat-message" className="chat-room__input-elements" placeholder="Enter message..." maxLength="50" />
             <button id="button-send-message" className="chat-room__input-elements" onClick={ props.onSendMessage() }>
                 Send
             </button>
             <button className="chat-room__input-elements" onClick={ props.onDoLogout() }>
                 Logout
             </button>
        </div>
    );
}

export default function ChatRoom(props) {
    return (
        <div id="chat-room-dialogue" className="chit-chat__dialogue chat-room">
            <ChatHeader status={ props.status }/>
            <label>Your chat name - { props.chatName }</label>
            <ChatInput onSendMessage={ props.onSendMessage } onDoLogout={ props.onDoLogout } />
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

