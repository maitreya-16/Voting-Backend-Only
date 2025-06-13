const mongoose = require('mongoose');
require('dotenv').config()
mongoose.connect(process.env.MONGODB_URL);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1); 
    }
};

module.exports = connectDB;