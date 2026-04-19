const mongoose = require('mongoose');

/**
 * connectDB — Connects our Express server to MongoDB Atlas.
 *
 * WHY a separate file?
 * Keeping DB logic here means index.js stays clean.
 * You can also easily swap databases without touching your server setup.
 */
const connectDB = async () => {
    try {
        // mongoose.connect() returns a promise — we await it
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Exit the process if DB connection fails — no point running without it
        process.exit(1);
    }
};

module.exports = connectDB;
