const Review = require('../models/Review');
const mongoose = require('mongoose');
const { deleteFromCloudinary } = require('../config/cloudinary');

exports.addReview = async (req, res) => {
  try {
    const { productId, rating, text } = req.body;
    
    // Get image URL from Cloudinary upload
    const image = req.file ? req.file.path : '';
    
    // Store image metadata for easier management
    const imageData = req.file ? {
      url: req.file.path,
      publicId: req.file.public_id
    } : null;

    const review = await Review.create({
      product: productId,
      user: req.user.id,
      rating,
      text,
      image,
      imageData
    });

    res.status(201).json(review);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    // Convert string to ObjectId
    const productId = mongoose.Types.ObjectId.createFromHexString(req.params.productId);

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name profilePhoto');

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete review with Cloudinary cleanup
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    // Delete image from Cloudinary if it exists
    if (review.imageData && review.imageData.publicId) {
      await deleteFromCloudinary(review.imageData.publicId);
    }

    // Delete review from database
    await Review.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Review and image deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update review (with optional image update)
exports.updateReview = async (req, res) => {
  try {
    const { rating, text } = req.body;
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    let updateData = { rating, text };

    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (review.imageData && review.imageData.publicId) {
        await deleteFromCloudinary(review.imageData.publicId);
      }

      updateData.image = req.file.path;
      updateData.imageData = {
        url: req.file.path,
        publicId: req.file.public_id
      };
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    ).populate('user', 'name profilePhoto');

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update review', error: error.message });
  }
};