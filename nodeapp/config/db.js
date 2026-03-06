const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;

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
