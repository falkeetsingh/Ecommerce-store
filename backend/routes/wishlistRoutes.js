const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getWishList, addToWishList, removeFromWishList } = require('../controllers/wishlistController');

router.get('/', auth, getWishList);
router.post('/add', auth, addToWishList);
router.post('/remove', auth, removeFromWishList);

module.exports = router;