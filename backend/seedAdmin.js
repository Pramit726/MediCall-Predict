const mongoose = require('mongoose');
const User = require('./models/User'); // Check your path
require('dotenv').config();

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (!adminExists) {
        const admin = new User({
            username: 'admin',
            password: 'password123', // hash this automatically
            role: 'Admin'
        });
        await admin.save();
        console.log("Admin user created successfully!");
    } else {
        console.log("Admin already exists.");
    }
    process.exit();
};

seed();