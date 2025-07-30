const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  res.json({ token: 'mock-jwt-token', message: 'Logged in' });
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

module.exports = router;