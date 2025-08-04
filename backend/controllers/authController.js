const jwt = require('jsonwebtoken');
const { addToBlacklist } = require('../utils/blacklist');
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Mock check - replace with DB call in production
  if (username === 'student' && password === 'password') {
    const token = jwt.sign({ role: 'student', username }, process.env.JWT_SECRET, { expiresIn: '15m' });
    return res.json({ token });
  }

  res.status(401).json({ error: 'Invalid credentials' });
};

exports.logout = (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(400).json({ error: 'No token provided.' });
  }

  addToBlacklist(token); // ✅ This marks the token as invalid
  res.json({ message: 'Logout successful. Token has been invalidated.' });
};
