require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const connectDB = require('./config/db'); 
const corsOptions = require('./config/cors'); 

const userRouter = require('./routers/userRouter');
const leaveRequestRouter = require('./routers/leaveRequestRouter');
const wfhRequestRouter = require('./routers/wfhRequestRouter');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger'); 

const app = express();

const port = process.env.port || 8080;

connectDB();

app.use(cors(corsOptions));
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Base route
app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/users', userRouter); 
app.use('/api/leaveRequests', leaveRequestRouter); 
app.use('/api/wfhRequests', wfhRequestRouter);     

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📑 Documentation: http://localhost:${port}/api-docs`);
});