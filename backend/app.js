const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use('/auth', authRoutes);

app.listen(3001, () => console.log('Backend running on port 3001'));
