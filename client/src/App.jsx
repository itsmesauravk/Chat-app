import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import ChatPage from './Pages/ChatPage';
import ChatHomepage from './Pages/ChatHomepage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path='/chat-home' element={<ChatHomepage />} />
        <Route path='/chat' element={<ChatPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
