const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/student', studentRoutes);

app.listen(3001, () => console.log('Backend running on port 3001'));