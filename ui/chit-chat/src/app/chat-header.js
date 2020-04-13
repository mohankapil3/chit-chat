import React from "react";
import './chat-header.css';

class ChatHeader extends React.Component {

  render() {
      return (
        <div>
          <h2 className="app-header">
              ChitChat
          </h2>
          <hr className="app-header-horizontal-rule"/>
        </div>
      );
  }
}

export default ChatHeader;