import React from 'react';
import { Avatar } from '@mui/material';

const ChatWindow = ({ dummyMessages }) => {
  return (
    <div className="chat-window">
      <div className="chat-navbar">
        <Avatar alt="User Avatar" src="https://via.placeholder.com/150" className="avatar" />
        <h3 className="full-name">Ada Lovelace</h3>
      </div>
      <div className="message-container">
        {dummyMessages.map(message => (
          <div key={message.id} className={`message ${message.sender === 'John Doe' ? 'sent' : 'received'}`}>
            <p>{message.message}</p>
          </div>
        ))}
      </div>
      <div className="send-chat">
        <input type="text" placeholder="Type your message..." className="chat-input" />
        <button className="send-button">Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
