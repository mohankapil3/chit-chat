import React from "react";
import './chat-header.css';

export default function ChatHeader(props) {
    return (
        <div>
          <h2 className="app-header">
              ChitChat
          </h2>
          <label>Status - { props.status }</label>
          <hr className="app-header__horizontal-rule"/>
        </div>
    );
}
