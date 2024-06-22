import React from 'react';
import { Avatar } from '@mui/material';

const ChatWindowStart = () => {
  return (
    <div className="chat-window-start">
      <img alt="Select User" src="https://static-00.iconduck.com/assets.00/message-icon-2043x2048-z7d1f8at.png" className="avatar" />
      <h3 className="start-message">Select any user to start a conversation</h3>
    </div>
  );
};

export default ChatWindowStart;
