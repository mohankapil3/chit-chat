import React from "react";
import './chat-header.css';

export default function ChatHeader(props) {
    return (
        <div>
          <h2 className="app-header">
              ChitChat
          </h2>
          <div>
              <label>Status - </label>
              <label className={ props.status.style }>{ props.status.text }</label>
          </div>
          <hr className="app-header__horizontal-rule"/>
        </div>
    );
}
