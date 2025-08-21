// ./config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI not set in environment');
  }

  try {
    // Modern mongoose.connect: options like useNewUrlParser/useUnifiedTopology are unnecessary
    await mongoose.connect(uri, {
      // If needed, you can explicitly specify dbName: 'sdt-db'
      // dbName: process.env.MONGODB_DBNAME || undefined
    });
    console.log('MongoDB Connected:', mongoose.connection.host || mongoose.connection.client.s.url || mongoose.connection.name);
    return mongoose.connection;
  } catch (err) {
    console.error('MongoDB connection error:', err && err.stack ? err.stack : err);
    throw err;
  }
};

module.exports = connectDB;
