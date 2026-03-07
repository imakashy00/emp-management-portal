require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 
const corsOptions = require('./config/cors'); 
const userRouter = require('./routers/userRouter');
const leaveRequest = require('./routers/leaveRequestRouter');
const wfhRequest = require('./routers/wfhRequestRouter');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger'); 

const app = express();

const port = process.env.port;

// Connecting to Database
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Base route
app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Routes
app.use('/api/users', userRouter); 
app.use('/api/leavesRequests', leaveRequest);
app.use('/api/wfhRequest', wfhRequest);

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});