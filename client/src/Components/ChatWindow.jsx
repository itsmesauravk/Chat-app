import React, { useEffect, useMemo, useState } from 'react';
import { Avatar } from '@mui/material';
import { io } from 'socket.io-client';

const ChatWindow = ({ dummyMessages = [] }) => {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState(dummyMessages);
  const googleId = localStorage.getItem('googleId');
  // const receiverId = '6677f9a9164782bad43a7e3c';  // einstine 
  const receiverId = '6677d96b092c7a9b455c9441';  // shinchan

  const socket = useMemo(() => {
    return io('http://localhost:4000', {
      withCredentials: true,
      auth: {
        googleId: googleId,
      },
    });
  }, [googleId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('message', { message, googleId, receiverId });
      console.log(`Message sent: ${message}`);
      setMessage('');
    }
  };

  useEffect(() => {
    // Connection event
    socket.on('connect', () => {
      console.log('Connected');
      console.log('Id:', socket.id);
    });

    // Listen for receive-message event
    socket.on('receive-message', (data) => {
      console.log(`Message received: ${data.message} from ${data.sender}`);
      setReceivedMessages((prevMessages) => [...prevMessages, { message: data.message, sender: data.sender }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-navbar">
        <Avatar alt="User Avatar" src="https://via.placeholder.com/150" className="avatar" />
        <h3 className="full-name">Ada Lovelace</h3>
      </div>
      <div className="message-container">
        {receivedMessages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === 'John Doe' ? 'sent' : 'received'}`}>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <div className="send-chat">
        <input
          type="text"
          placeholder="Type your message..."
          className="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="send-button" onClick={handleSubmit}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
