import React, { useEffect, useState } from 'react';
import '../css/ChatHomepage.css';

import { Avatar } from '@mui/material';
import { AddCircle, Group } from '@mui/icons-material';
import ChatWindow from '../Components/ChatWindow';
import ChatWindowStart from '../Components/ChatWindowStart';
import { useNavigate } from 'react-router-dom';
import 'ldrs/tailspin'
import Cookies from 'js-cookie';


const ChatHomepage = () => {
  const [profile, setProfile] = useState({});
  const navigate = useNavigate()
  const [users, setUsers] = useState({})
  const [loadingPage, setLoadingPage] = useState(true);
  const [isUserSelected, setIsUserSelected] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const googleIdd = Cookies.get('googleId');
    const accessToken = Cookies.get('accessToken');
    console.log(googleIdd, accessToken)

  }, [])




  // const dummyMessages = null;
  const dummyMessages = [
    {
      id: 1,
      message: 'Hello, how are you?',
      sender: 'John Doe',
      time: '10:00 AM',
    },
    {
      id: 2,
      message: 'I am fine, thank you. How are you?',
      sender: 'Jane Doe',
      time: '10:05 AM',
    },
    {
      id: 3,
      message: 'I am also fine. Can we meet today?',
      sender: 'John Doe',
      time: '10:10 AM',
    },
  ];

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

  const getUsers = async() =>{
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/get-users`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if(data.success){
        setUsers(data.users)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        navigate('/');
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getProfile();
    getUsers()


    setTimeout(() => {
      setLoadingPage(false)
    }, 1000);
  }, []);


  const handleUserSelect =(userData)=>{
    setSelectedUserId(userData._id)
    setIsUserSelected(true)
    console.log('User Selected : ', userData._id)
    console.log('User Selected data : ', userData)
  }

  return (
    <>
    {loadingPage ?
       <div className="loading-spinner">
            <div className="loading-container"> 
                <l-tailspin
                size="70"
                stroke="5"
                speed="0.9"
                color="#BB86FC" 
                ></l-tailspin>
            </div>
        </div>
        :
        <div className="chat-homepage-container">
          <div className="sidebar">
            <div className="user-profile" >
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
              {users.length >0 && users.map(user => (
                <div key={user._id} 
                className={`chat-user ${selectedUserId === user._id ? 'selected' : ''}`} 
                onClick={()=>handleUserSelect(user)}>
                  <Avatar alt={user.name} src={user.picture} className="avatar" />
                  <p>{user.name}</p>
                </div>
              ))}
            </div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
          {isUserSelected === false ? <ChatWindowStart /> : <ChatWindow dummyMessages={dummyMessages} />}
          <div className="user-profile-sidebar">
            <img alt="User Avatar" src="https://via.placeholder.com/150" className="avatar-user" />
            <h3 className="full-name">
              <p>John Doe</p>
              <p className="email"><strong>Email:</strong> John@gmail.com</p>
              <p className="phone"><strong>Phone:</strong> 1234567890</p>
            </h3>
          </div>
      </div>
      }
    </>
   
  );
};

export default ChatHomepage;
