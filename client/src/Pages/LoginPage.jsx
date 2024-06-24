import React, { useEffect, useState } from 'react';
import '../css/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'

const LoginPage = () => {

  const [email, setEmail] = useState('');
  const [errMsg, setErrMsg] = useState(''); 
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      
      if (data.success) {
        console.log(data);
        localStorage.setItem("googleId", data.googleId)
        Cookies.set('googleId',data.googleId)
        navigate('/chat-home');
      } else {
        setErrMsg(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setErrMsg('');
    }, 2000);

  },[errMsg])

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="title">Hang out anytime, anywhere</h1>
        <p className="subtitle">
          <span className='app-name'>ChatUs</span> makes it easy and fun to stay close to your favorite people.
        </p>
        {errMsg && <p className="error-message">{errMsg}</p>}
        <input
          type="text"
          placeholder="Email or phone number"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <button className="login-button" onClick={handleLogin}>Log in</button>
        <p className="forgot-password">Forgotten your password?</p>
        <p className="create-account-message">
          Don't have an account? Sign up using Google now.
        </p>
        <button
          onClick={handleGoogleLogin}
          className="google-button"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
