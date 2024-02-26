// Import Mongoose. Package responsible to make the connection with MongoDB
const mongoose = require('mongoose');

// Sets the MongoDB URI for the app
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tiles';

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    const dbName = mongoose.connection.name;
    console.log(`Connected to MongoDB! Database name: "${dbName}"`);
  } catch (err) {
    console.error('Error connecting to MongoDB: ', err);
  }
}

connectDB();
