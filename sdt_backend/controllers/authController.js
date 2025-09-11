//controllers/authController.js
// const jwt = require('jsonwebtoken');
// const { addToBlacklist } = require('../utils/blacklist');
// exports.login = async (req, res) => {
//   const { username, password } = req.body;

//   // Mock check - replace with DB call in production
//   if (username === 'student' && password === 'password') {
//     const token = jwt.sign({ role: 'student', username }, process.env.JWT_SECRET, { expiresIn: '15m' });
//     return res.json({ token });
//   }

//   res.status(401).json({ error: 'Invalid credentials' });
// };

// exports.logout = (req, res) => {
//   const token = req.headers['authorization']?.split(' ')[1];
//   if (!token) {
//     return res.status(400).json({ error: 'No token provided.' });
//   }

//   addToBlacklist(token); // ✅ This marks the token as invalid
//   res.json({ message: 'Logout successful. Token has been invalidated.' });
// };

// controllers/authController.js
const jwt = require('jsonwebtoken');
//const bcrypt = require('bcrypt'); // keep for later if you hash passwords
const DigitalTwin = require('../models/DigitalTwin');
const { addToBlacklist } = require('../utils/blacklist');

exports.login = async (req, res) => {
  try {
    const { studentNumber, password } = req.body;

    if (!studentNumber || !password) {
      return res.status(400).json({ error: 'Student number and password are required' });
    }

    // Parse and validate student number
    const parsedStudentId = parseInt(studentNumber);
    if (isNaN(parsedStudentId)) {
      return res.status(400).json({ error: 'Invalid student number format' });
    }

    // Find student by id_student
    const student = await DigitalTwin.findOne({ id_student: parsedStudentId });
    if (!student) {
      return res.status(401).json({ error: 'Invalid student number or password' });
    }

    // Temporary: plain-text password check
    // If later you hash them: const isMatch = await bcrypt.compare(password, student.password);
    if (password !== 'TempPass123!') {
      return res.status(401).json({ error: 'Invalid student number or password' });
    }

    // Sign JWT
    const token = jwt.sign(
      { role: 'student', id_student: student.id_student },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token, studentId: student.id_student });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.logout = (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(400).json({ error: 'No token provided.' });
  }

  addToBlacklist(token); // ✅ blacklist this token
  res.json({ message: 'Logout successful. Token has been invalidated.' });
};

