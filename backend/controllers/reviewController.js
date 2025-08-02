const Review = require('../models/Review');
const mongoose = require('mongoose');

exports.addReview = async (req, res) => {
  try {
    const { productId, rating, text } = req.body;
    const image = req.file ? `/uploads/reviews/${req.file.filename}` : '';

    const review = await Review.create({
      product: productId,
      user: req.user.id,
      rating,
      text,
      image,
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