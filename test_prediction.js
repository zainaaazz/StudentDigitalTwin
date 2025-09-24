const jwt = require('jsonwebtoken');

const token = jwt.sign({ userId: 6516, role: 'student' }, 'supersecretkey');

fetch('http://localhost:5000/digitaltwin/predictions/day-window?studentId=6516&startDay=1&endDay=5', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(err => console.error('Error:', err));