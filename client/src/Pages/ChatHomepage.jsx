import React, { useEffect, useState } from 'react';
import '../css/ChatHomepage.css';
import { Avatar } from '@mui/material';
import { AddCircle, Group } from '@mui/icons-material';
import ChatWindow from '../Components/ChatWindow';
import ChatWindowStart from '../Components/ChatWindowStart';
import { useNavigate } from 'react-router-dom';

const ChatHomepage = () => {
  const [profile, setProfile] = useState({});
  const navigate = useNavigate()

  const dummyUsers = [
    { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Alice Johnson', avatar: 'https://via.placeholder.com/150' },
  ];

  const dummyMessages = null;

  const getProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/get-profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      setProfile(data.data);
    }
    catch (err) {
      console.log(err);
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        navigate('/');
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="chat-homepage-container">
      <div className="sidebar">
        <div className="user-profile">
          <Avatar alt="User Avatar" src={profile.picture} className="avatar" />
          <h3 className="full-name">{profile.name}</h3>
        </div>
        <div className="actions">
          <h4>Action</h4>
          <ul className="action-list">
            <li><AddCircle /> Add People</li>
            <li><Group /> Add Group</li>
          </ul>
        </div>
        <div className="chat-list">
          <h4>Chat</h4>
          {dummyUsers.map(user => (
            <div key={user.id} className="chat-user">
              <Avatar alt={user.name} src={user.avatar} className="avatar" />
              <p>{user.name}</p>
            </div>
          ))}
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {dummyMessages === null ? <ChatWindowStart /> : <ChatWindow dummyMessages={dummyMessages} />}
      <div className="user-profile-sidebar">
        <img alt="User Avatar" src="https://via.placeholder.com/150" className="avatar-user" />
        <h3 className="full-name">
          <p>John Doe</p>
          <p className="email"><strong>Email:</strong> John@gmail.com</p>
          <p className="phone"><strong>Phone:</strong> 1234567890</p>
        </h3>
      </div>
    </div>
  );
};

export default ChatHomepage;
