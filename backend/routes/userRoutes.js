const express = require('express');
const router = express.Router();
const { updateProfile, changePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');
const User = require('../models/User');
const upload = require('../middleware/upload'); // ✅ Using centralized upload.js


// Upload user profile photo
router.post('/profile-photo', auth, upload.single('profilePhoto'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Save photo path
        user.profilePhoto = `/uploads/userProfile/${req.file.filename}`;
        await user.save();

        res.json({
            message: 'Profile photo uploaded successfully',
            profilePhoto: user.profilePhoto
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Update profile (optional photo upload)
router.put('/profile', auth, upload.single('profilePhoto'), updateProfile);

router.put('/change-password', auth, changePassword);

module.exports = router;
