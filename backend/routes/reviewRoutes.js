const express = require('express');
const router = express.Router();
const { addReview, getProductReviews, deleteReview, updateReview } = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const { reviewUpload } = require('../config/cloudinary');

// Add review with optional image
router.post('/', auth, reviewUpload.single('reviewImage'), addReview);

// Get all reviews for a product
router.get('/:productId', getProductReviews);

// Delete review (user can delete their own, admin can delete any)
router.delete('/:id', auth, deleteReview);

// Update review with optional image update
router.put('/:id', auth, reviewUpload.single('reviewImage'), updateReview);

module.exports = router;