const mongoose = require('mongoose');

exports.connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/bank_management');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};


