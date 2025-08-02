const express = require('express');
const router = express.Router();
const {registerUser, loginUser, logoutUser, me, changePassword} = require('../controllers/authController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth')

router.get('/me', auth, me);
router.post('/signup', upload.single('profilePhoto'), registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.put('/user_change_password', auth, changePassword);

module.exports = router;