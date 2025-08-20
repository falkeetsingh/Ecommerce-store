const express = require('express');
const router = express.Router();
const { updateProfile, changePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { profileUpload, deleteFromCloudinary } = require('../config/cloudinary');

// Upload user profile photo
router.post('/profile-photo', auth, profileUpload.single('profilePhoto'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            // Clean up uploaded image if user not found
            if (req.file && req.file.public_id) {
                await deleteFromCloudinary(req.file.public_id);
            }
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete old profile photo from Cloudinary if it exists
        if (user.profilePhotoData && user.profilePhotoData.publicId) {
            await deleteFromCloudinary(user.profilePhotoData.publicId);
        }

        // Save new photo data
        user.profilePhoto = req.file.path; // Cloudinary URL
        user.profilePhotoData = {
            url: req.file.path,
            publicId: req.file.public_id
        };
        await user.save();

        res.json({
            message: 'Profile photo uploaded successfully',
            profilePhoto: user.profilePhoto
        });

    } catch (error) {
        console.error(error);
        // Clean up uploaded image if error occurs
        if (req.file && req.file.public_id) {
            await deleteFromCloudinary(req.file.public_id);
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update profile (optional photo upload)
router.put('/profile', auth, profileUpload.single('profilePhoto'), updateProfile);

// Change password
router.put('/change-password', auth, changePassword);

module.exports = router;