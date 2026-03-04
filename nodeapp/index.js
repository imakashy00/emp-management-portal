
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Import DB config
const corsOptions = require('./config/cors'); // Import CORS config
const app = express();

// const PORT = process.env.PORT || 8080;
const PORT = 8080;

// Connect to Database
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
