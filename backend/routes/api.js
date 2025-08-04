const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

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
