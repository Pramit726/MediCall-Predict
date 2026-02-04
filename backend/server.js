const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json()); // Parses incoming JSON
app.use(cors());         // Enables Cross-Origin requests
app.use(morgan('dev'));  // Logs requests to terminal

// Import Routes
const authRoutes = require('./routes/authRoutes');
const forecastRoutes = require('./routes/forecastRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api', forecastRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("DB Error:", err));

// Test Route
app.get('/', (req, res) => res.send("MediCall Backend is Running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
