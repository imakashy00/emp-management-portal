const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/workbuddy'

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ MongoDB Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
