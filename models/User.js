const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['employee', 'admin'], default: 'employee' },
    dateOfJoining: { type: Date, default: Date.now },
    leaveBalance: { type: Number, default: 20 },
});

module.exports = mongoose.model('User', userSchema);