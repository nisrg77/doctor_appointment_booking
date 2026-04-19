const mongoose = require('mongoose');

// Define schema (structure of user)
const userSchema = new mongoose.Schema({
    // Name of user
    name: {
        type: String,
        required: true
    },
    // Email (must be unique)
    email: {
        type: String,
        required: true,
        unique: true
    },
    // Password
    password: {
        type: String,
        required: true
    },
    // Role (user / provider / admin)
    role: {
        type: String,
        default: "user"
    }
}, { timestamps: true }); // adds createdAt, updatedAt

// Create model from schema
const User = mongoose.model('User', userSchema);

// Export model
module.exports = User;