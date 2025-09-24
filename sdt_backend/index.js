// index.js (cleaned)
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const envPath = path.resolve(__dirname, '.env');
const dotenvResult = require('dotenv').config({ path: envPath });
if (dotenvResult.error) {
  console.warn(`[env] Could not load ${envPath}: ${dotenvResult.error.message}`);
}

const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const apiRoutes = require('./routes/api');
const digitalTwinRoutes = require('./routes/digitalTwinRoutes');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Helpers ----------
function sanitizeMountPath(maybeUrlOrPath, fallback = '/') {
  if (!maybeUrlOrPath) return fallback;
  try {
    const u = new URL(maybeUrlOrPath);
    return u.pathname && u.pathname !== '/' ? u.pathname : fallback;
  } catch (e) {
    return maybeUrlOrPath.startsWith('/') ? maybeUrlOrPath : `/${maybeUrlOrPath}`;
  }
}

// ---------- Routes mounting ----------
const authMount = sanitizeMountPath(process.env.AUTH_MOUNT, '/auth');
const studentMount = sanitizeMountPath(process.env.STUDENT_MOUNT, '/student');
const apiMount = sanitizeMountPath(process.env.API_MOUNT, '/api');
const digitalTwinMount = sanitizeMountPath(process.env.DIGITALTWIN_MOUNT, '/digitaltwin');

app.use(authMount, authRoutes);
app.use(studentMount, studentRoutes);
app.use(apiMount, apiRoutes);
app.use(digitalTwinMount, digitalTwinRoutes);

// ---------- Health check ----------
app.get('/health', (req, res) => {
  const state = mongoose.connection.readyState;
  const dbStatus =
    state === 1 ? 'connected' :
    state === 2 ? 'connecting' :
    state === 3 ? 'disconnecting' : 'disconnected';

  res.status(200).json({
    success: true,
    server: 'ok',
    db: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// 404 handler — no path argument (safe)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Single error-handling middleware (after 404)
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// ---------- Global process handlers ----------
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION (shutting down):', err && err.stack ? err.stack : err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION (shutting down):', reason && reason.stack ? reason.stack : reason);
  process.exit(1);
});

// ---------- Start server after DB connect ----------
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log('Mounts:');
      console.log(` - auth   => ${authMount}`);
      console.log(` - student=> ${studentMount}`);
      console.log(` - api    => ${apiMount}`);
      console.log(` - digitaltwin => ${digitalTwinMount}`);
    });
  } catch (err) {
    console.error('Failed to start server due to DB/connect error:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}

start();

