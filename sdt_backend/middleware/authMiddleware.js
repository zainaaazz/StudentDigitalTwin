// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { isBlacklisted } = require('../utils/blacklist');

module.exports = function (req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  if (isBlacklisted(token)) {
    return res.status(403).json({ error: 'Token has been invalidated (blacklisted).' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};
