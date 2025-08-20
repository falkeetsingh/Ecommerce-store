const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    logoutUser, 
    me, 
    changePassword, 
    updateProfile,
    deleteAccount,
    verifyEmail,
    resendVerification, 
} = require('../controllers/authController');
const { profileUpload } = require('../config/cloudinary');
const auth = require('../middleware/auth');

router.get('/me', auth, me);
router.post('/signup', profileUpload.single('profilePhoto'), registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.put('/user_change_password', auth, changePassword);
router.put('/update-profile', auth, profileUpload.single('profilePhoto'), updateProfile);
router.delete('/delete-account', auth, deleteAccount);

router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

module.exports = router;