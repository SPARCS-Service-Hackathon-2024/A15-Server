require('dotenv').config();
const mongoose = require('mongoose');

async function connectDatabase() {
  try {
    const dbURL = process.env.DB_URL

    await mongoose.connect(dbURL)

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

module.exports = {
  connectDatabase,
};
