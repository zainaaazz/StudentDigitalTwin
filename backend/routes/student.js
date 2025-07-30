const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => {
  res.json({ id: 1, name: "John Doe", course: "Computer Science" });
});

router.get('/prediction', (req, res) => {
  res.json({ prediction: "Pass", confidence: 0.87 });
});

router.get('/log', (req, res) => {
  res.json([{ timestamp: "2025-07-30", activity: "Viewed course material" }]);
});

module.exports = router;