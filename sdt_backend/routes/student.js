const express = require('express');
const {
  getProfile,
  getPrediction,
  getActivityLog
} = require('../controllers/studentController');

const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.get('/prediction', authMiddleware, getPrediction);
router.get('/activity/log', authMiddleware, getActivityLog);

router.get('/getStudentData', authMiddleware, (req, res) => {
  const data = {
    name: "John Doe",
    course: "Computer Science",
    year: 3,
    gpa: 3.4,
    attendance: "95%"
  };
  res.json(data);
});

module.exports = router;
