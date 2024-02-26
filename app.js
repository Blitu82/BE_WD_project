// Gets access to the environment variables/settings
require('dotenv').config();

// Connects to MongoDB
require('./db');

// Create an express server instance to handle http requests
const express = require('express');
const app = express();

// ℹ️ This function is getting exported from the config folder and runs most pieces of middleware
require('./config')(app);

// Routes - TO BE CREATED
const gridRoutes = require('./routes/grid.routes');
app.use('/api', gridRoutes);

// Handle Errors - TO BE CREATED

module.exports = app;
