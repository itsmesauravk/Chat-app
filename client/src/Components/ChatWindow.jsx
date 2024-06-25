import React, { useEffect, useMemo, useState } from 'react';
import { Avatar } from '@mui/material';
import { io } from 'socket.io-client';

const ChatWindow = ({ selectedUserData }) => {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');

  const googleId = localStorage.getItem('googleId');
  const receiverId = selectedUserData._id;

  const getMessages = async () => {
    try {
      const response = await fetch(`http://localhost:4000/messages/${googleId}/${selectedUserData._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setReceivedMessages(data.messages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedUserData) {
      getMessages();
    }
  }, [selectedUserData]);

  const socket = useMemo(() => {
    return io('http://localhost:4000', {
      withCredentials: true,
      auth: {
        googleId: googleId,
      },
    });
  }, [googleId]);

  const handleTyping = () => {
    socket.emit('typing', { sender: googleId, receiverSocketId: selectedUserData.socketId });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && selectedUserData) {
      const data = { message, googleId, receiverId: selectedUserData._id };
      socket.emit('message', data);
      setReceivedMessages((prevMessages) => [
        ...prevMessages,
        { message, sender: 'You', receiver: selectedUserData._id },
      ]);
      setMessage('');
    }
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected');
      console.log('Id:', socket.id);
    });

    socket.on('receive-message', (data) => {
      setReceivedMessages((prevMessages) => [
        ...prevMessages,
        { message: data.message, sender: data.sender, receiver: googleId },
      ]);
    });

    socket.on('typing', (data) => {
      if (data.sender !== googleId) {
        setIsTyping(true);
        setTypingUser(data.sender);
        setTimeout(() => {
          setIsTyping(false)
          setTypingUser('');
        }, 3000);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, googleId]);

  return (
    <div className="chat-window">
      <div className="chat-navbar">
        <Avatar alt="User Avatar" src={selectedUserData.picture} className="avatar" />
        <h3 className="full-name">{selectedUserData.name}</h3>
      </div>
      <div className="message-container">
        {receivedMessages.map((msg, index) => (
          <div key={index} className={`message ${msg.receiver === receiverId ? 'sent' : 'received'}`}>
            <p>{msg.message}</p>
          </div>
        ))}
        {isTyping && <div className="typing-indicator">{typingUser}typing...</div>}
      </div>
      <div className="send-chat">
        <input
          type="text"
          placeholder="Type your message..."
          className="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleTyping}
        />
        <button className="send-button" onClick={handleSubmit}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
