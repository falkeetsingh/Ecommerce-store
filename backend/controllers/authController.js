const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { deleteFromCloudinary } = require('../config/cloudinary');

// Common fake/disposable email patterns
const suspiciousPatterns = [
    /^[a-z]{1,3}@gmail\.com$/,  // Very short like "a@gmail.com"
    /^test\d*@gmail\.com$/,     // test123@gmail.com
    /^fake\d*@gmail\.com$/,     // fake@gmail.com
    /^temp\d*@gmail\.com$/,     // temp@gmail.com
    /^demo\d*@gmail\.com$/,     // demo@gmail.com
    /^\d+@gmail\.com$/,         // 123@gmail.com
    /^[a-z]\d+@gmail\.com$/,    // a123@gmail.com
    /^abc\d*@gmail\.com$/,      // abc@gmail.com, abc123@gmail.com
];

// Known real Gmail patterns (more likely to be real)
const realPatterns = [
    /^[a-zA-Z0-9._%+-]{6,}@gmail\.com$/,  // At least 6 chars before @
    /^[a-zA-Z]+[a-zA-Z0-9._%+-]*@gmail\.com$/,  // Starts with letters
];

// Free Gmail validation system
const validateGmailFree = async (email) => {
    const normalizedEmail = email.toLowerCase().trim();
    
    // 1. Basic format validation
    if (!normalizedEmail.endsWith('@gmail.com')) {
        return { 
            valid: false, 
            reason: 'Only Gmail addresses are allowed',
            confidence: 'high'
        };
    }

    // 2. Check for suspicious patterns
    for (const pattern of suspiciousPatterns) {
        if (pattern.test(normalizedEmail)) {
            return { 
                valid: false, 
                reason: 'Email appears to be fake or temporary',
                confidence: 'high'
            };
        }
    }

    // 3. Check for real patterns
    const looksReal = realPatterns.some(pattern => pattern.test(normalizedEmail));
    
    // 4. Additional checks
    const localPart = normalizedEmail.split('@')[0];
    const hasNumbers = /\d/.test(localPart);
    const hasDots = /\./.test(localPart);
    const length = localPart.length;
    
    // Calculate confidence score
    let confidence = 50; // Base confidence
    
    if (looksReal) confidence += 20;
    if (length >= 6) confidence += 15;
    if (hasDots) confidence += 10;
    if (hasNumbers && length > 4) confidence += 10;
    if (length < 4) confidence -= 30;
    if (!/[a-zA-Z]/.test(localPart)) confidence -= 20; // No letters
    
    const isValid = confidence >= 60;
    
    return {
        valid: isValid,
        reason: isValid ? 'Email passes validation checks' : 'Email appears suspicious',
        confidence: confidence >= 80 ? 'high' : confidence >= 60 ? 'medium' : 'low',
        score: confidence
    };
};

// Email sender function
const sendVerificationEmail = async (email, token, name) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email Address',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome ${name}!</h2>
                <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
                <a href="${verificationUrl}" 
                   style="background-color: #007bff; color: white; padding: 10px 20px; 
                          text-decoration: none; border-radius: 5px; display: inline-block;">
                    Verify Email Address
                </a>
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't create an account, please ignore this email.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

// generate jwt
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }  
    );
};

// @desc Sign up 
// @route POST /api/auth/signup
// @access public
const registerUser = async(req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Input validation
        if (!name || !email || !password) {
            if (req.file && req.file.public_id) {
                await deleteFromCloudinary(req.file.public_id);
            }
            return res.status(400).json({ 
                message: 'Name, email, and password are required' 
            });
        }

        if (password.length < 6) {
            if (req.file && req.file.public_id) {
                await deleteFromCloudinary(req.file.public_id);
            }
            return res.status(400).json({ 
                message: 'Password must be at least 6 characters long' 
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        
        // Free Gmail validation
        const validation = await validateGmailFree(normalizedEmail);
        
        if (!validation.valid) {
            if (req.file && req.file.public_id) {
                await deleteFromCloudinary(req.file.public_id);
            }
            return res.status(400).json({ 
                message: validation.reason 
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            if (req.file && req.file.public_id) {
                await deleteFromCloudinary(req.file.public_id);
            }
            return res.status(400).json({ message: 'User already exists!' });
        }

        // Generate verification token with better entropy
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

        // Debug logs
        console.log('Creating user with verification token:', verificationToken);
        console.log('Token expires at:', verificationExpires);

        // Get profile photo URL from Cloudinary upload
        const profilePhoto = req.file ? req.file.path : '';
        
        // Store image metadata for easier management
        const profilePhotoData = req.file ? {
            url: req.file.path,
            publicId: req.file.public_id
        } : null;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            profilePhoto,
            profilePhotoData,
            verified: false, // Explicitly set to false
            verificationToken,
            verificationExpires,
            validationScore: validation.score,
            createdAt: new Date(),
        });

        console.log('User created with verified status:', user.verified);

        // Send verification email
        try {
            await sendVerificationEmail(normalizedEmail, verificationToken, name.trim());
            console.log('Verification email sent to:', normalizedEmail);
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            // Don't fail registration if email fails, but log it
        }

        // Log suspicious registrations for manual review
        if (validation.confidence === 'low') {
            console.log(`Suspicious registration: ${normalizedEmail} (Score: ${validation.score})`);
        }

        res.status(201).json({ 
            message: 'Registration successful! Please check your Gmail to verify your account.',
            requiresVerification: true
        });

    } catch (error) {
        // Clean up uploaded image if registration fails
        if (req.file && req.file.public_id) {
            await deleteFromCloudinary(req.file.public_id);
        }
        
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Registration failed. Please try again.' 
        });
    }
};

// @desc Login user
// @route POST /api/auth/login
// @access public 
const loginUser = async(req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Explicitly select password field since it's excluded by default
        const user = await User.findOne({ email: normalizedEmail }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if email is verified
        if (!user.verified) {
            return res.status(401).json({ 
                message: 'Please verify your email address before logging in. Check your Gmail for the verification link.',
                needsVerification: true
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user);

        // Setting cookie
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        };

        if (rememberMe) {
            cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        } // else, no maxAge → session cookie

        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePhoto: user.profilePhoto,
            isAdmin: user.isAdmin,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// @desc Verify email
// @route GET /api/auth/verify-email
// @access public
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        
        if (!token) {
            return res.status(400).json({ message: 'Verification token is required' });
        }

        // Add debugging logs
        console.log('Verifying token:', token);
        console.log('Current time:', new Date());

        const user = await User.findOne({
            verificationToken: token,
            verificationExpires: { $gt: new Date() } // Use new Date() instead of Date.now()
        });

        if (!user) {
            // Additional debugging - check if user exists with this token regardless of expiry
            const userWithToken = await User.findOne({ verificationToken: token });
            
            if (!userWithToken) {
                console.log('No user found with this token');
                return res.status(400).json({ 
                    message: 'Invalid verification token' 
                });
            } else {
                console.log('User found but token expired. Expiry:', userWithToken.verificationExpires);
                return res.status(400).json({ 
                    message: 'Verification token has expired. Please request a new verification email.' 
                });
            }
        }

        // Check if already verified
        if (user.verified) {
            return res.status(400).json({ 
                message: 'Email is already verified' 
            });
        }

        console.log('Verifying user:', user.email);

        // Mark user as verified
        user.verified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;
        user.emailVerifiedAt = new Date();
        await user.save();

        console.log('User verified successfully:', user.email);

        res.json({ 
            message: 'Email verified successfully! You can now log in.' 
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ message: 'Verification failed' });
    }
};


// @desc Resend verification email
// @route POST /api/auth/resend-verification
// @access public
const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.verified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        console.log('Resending verification for:', normalizedEmail);
        console.log('New token:', verificationToken);
        console.log('New expiry:', verificationExpires);

        user.verificationToken = verificationToken;
        user.verificationExpires = verificationExpires;
        await user.save();

        // Send verification email
        await sendVerificationEmail(normalizedEmail, verificationToken, user.name);

        res.json({ 
            message: 'Verification email sent! Please check your Gmail.' 
        });

    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ message: 'Failed to resend verification email' });
    }
};

// Keep all your existing functions unchanged
const logoutUser = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
}

const me = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePhoto: user.profilePhoto,
            isAdmin: user.isAdmin,
            verified: user.verified, // Add this to show verification status
        });
    } catch (error) {
        console.error('Error in /me endpoint:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let updateData = { name: name?.trim() };

        // If email is being changed, validate the new Gmail address
        if (email && email.toLowerCase().trim() !== user.email) {
            const normalizedEmail = email.toLowerCase().trim();
            
            // Check if new email already exists
            const emailExists = await User.findOne({ 
                email: normalizedEmail,
                _id: { $ne: userId }
            });
            
            if (emailExists) {
                if (req.file && req.file.public_id) {
                    await deleteFromCloudinary(req.file.public_id);
                }
                return res.status(400).json({ message: 'Email already in use' });
            }

            // Validate new Gmail address
            const validation = await validateGmailFree(normalizedEmail);

            if (!validation.valid) {
                if (req.file && req.file.public_id) {
                    await deleteFromCloudinary(req.file.public_id);
                }
                return res.status(400).json({ 
                    message: validation.reason
                });
            }

            updateData.email = normalizedEmail;
            updateData.verified = false; // Require re-verification for new email
            updateData.verificationToken = crypto.randomBytes(32).toString('hex');
            updateData.verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }

        // Handle profile photo update
        if (req.file) {
            // Delete old profile photo from Cloudinary if it exists
            if (user.profilePhotoData && user.profilePhotoData.publicId) {
                await deleteFromCloudinary(user.profilePhotoData.publicId);
            }

            updateData.profilePhoto = req.file.path;
            updateData.profilePhotoData = {
                url: req.file.path,
                publicId: req.file.public_id
            };
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        
        // If email was changed, send verification email
        if (updateData.email && updateData.verificationToken) {
            await sendVerificationEmail(updateData.email, updateData.verificationToken, updatedUser.name);
        }
        
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profilePhoto: updatedUser.profilePhoto,
            message: updateData.email ? 'Profile updated! Please verify your new email address.' : 'Profile updated successfully!'
        });
    } catch (error) {
        // Clean up uploaded image if update fails
        if (req.file && req.file.public_id) {
            await deleteFromCloudinary(req.file.public_id);
        }
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Profile update failed' });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new passwords are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }

        const user = await User.findById(userId).select('+password');

        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ message: 'Password change failed' });
    }
};

// Delete user account with Cloudinary cleanup
const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete profile photo from Cloudinary if it exists
        if (user.profilePhotoData && user.profilePhotoData.publicId) {
            await deleteFromCloudinary(user.profilePhotoData.publicId);
        }

        // Delete user account
        await User.findByIdAndDelete(userId);

        // Clear cookie
        res.cookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            expires: new Date(0)
        });

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Account deletion error:', error);
        res.status(500).json({ message: 'Account deletion failed' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    me,
    updateProfile,
    changePassword,
    deleteAccount,
    verifyEmail,
    resendVerification,
};