import React from 'react';
import './join-chat.css';

class Dialogue extends React.Component {
  render() {
      return (
        <div id="join-chat-dialogue" className="dialogue">
          <h2 className="app-header">
            ChitChat
          </h2>
          <form className="dialogue-form">
            <label>
              Enter name
            </label>
            <input type="text" id="name"/>
            <button onClick={() => alert(document.getElementById('name').value)}>
              Join room
            </button>
          </form>
        </div>
      );
  }
}

export default Dialogue;
