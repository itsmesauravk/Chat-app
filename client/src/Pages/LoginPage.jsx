import React from 'react';
import '../css/LoginPage.css';

const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="title">Hang out anytime, anywhere</h1>
        <p className="subtitle">
          <span className='app-name'>ChatUs</span> makes it easy and fun to stay close to your favorite people.
        </p>
        <input
          type="text"
          placeholder="Email or phone number"
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
        />
        <button className="login-button">Log in</button>
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
