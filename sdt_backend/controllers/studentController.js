exports.getProfile = async (req, res) => {
  const username = req.user.username;

  // Simulated DB output
  const profile = {
    username,
    academicPerformance: 'Satisfactory',
    riskLevel: 'Low',
    weeklyEngagement: 84,
  };

  res.json(profile);
};

exports.getPrediction = async (req, res) => {
  // Simulate ML model output
  const prediction = {
    classification: 'At Risk',
    confidence: 0.76,
    recommendation: 'Schedule check-in with advisor',
  };

  res.json(prediction);
};

exports.getActivityLog = async (req, res) => {
  // Simulate activity log data
  const logs = [
    { date: '2025-07-28', action: 'Viewed dashboard' },
    { date: '2025-07-29', action: 'Submitted assignment' },
  ];

  res.json(logs);
};
