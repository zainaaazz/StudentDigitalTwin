const express = require('express');
const router = express.Router();

// Example route
router.get('/getStudentData', (req, res) => {
  // Replace with real data or database call
  const dummyData = [
    { id: 1, name: 'Alice', grade: 'A' },
    { id: 2, name: 'Bob', grade: 'B' }
  ];

  res.json(dummyData);
});

module.exports = router;
