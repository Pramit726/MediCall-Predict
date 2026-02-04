const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'Staff' }, // e.g., Admin, Staff
    createdAt: { type: Date, default: Date.now }
});

// Middleware: Hash password before saving to DB
UserSchema.pre('save', async function() {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw new Error(error); // This will stop the save and throw an error
    }
});

module.exports = mongoose.model('User', UserSchema);