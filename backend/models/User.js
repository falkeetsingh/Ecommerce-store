const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        trim: true,
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [8, "Password must be at least 8 characters long"],
        select: false // Don't include password in queries by default
    },
    profilePhoto: { 
        type: String, 
        default: '' // Cloudinary URL
    },
    profilePhotoData: {
        url: String,
        publicId: String  // For deletion from Cloudinary
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    },
    verified: { type: Boolean, default: false },
    verificationToken: String,
    verificationExpires: Date,
    validationScore: Number,
    emailVerifiedAt: Date,
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ isAdmin: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);
module.exports = User;