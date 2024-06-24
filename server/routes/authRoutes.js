const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Persons = require('../schema/users'); 
const router = express.Router();
 
// Initiates the Google OAuth 2.0 authentication flow
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback URL for handling the OAuth 2.0 response
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), async (req, res) => {
  // Successful authentication, generate tokens and store user data in session
  const user = req.user;

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30d'
  });

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
  res.cookie('googleId', user.googleId, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  res.redirect(`${process.env.CLIENT_URL}/chat-home`);
});



module.exports = router;
