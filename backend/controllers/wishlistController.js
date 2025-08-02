const User = require('../models/User');
const Product = require('../models/product');

exports.getWishList = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist');
        res.json(user.wishlist);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ message: 'Failed to fetch wishlist', error: error.message });
    }
};

exports.addToWishList = async(req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user.wishlist.includes(productId)) {
        user.wishlist.push(productId);
        await user.save();
        }

        const populatedUser = await User.findById(req.user.id).populate('wishlist');
        res.json(populatedUser.wishlist);
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ message: 'Failed to add to wishlist', error: error.message });
    }
};

exports.removeFromWishList = async(req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user.id);
        
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();
        
        const populatedUser = await User.findById(req.user.id).populate('wishlist');
        res.json(populatedUser.wishlist);
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ message: 'Failed to remove from wishlist', error: error.message });
    }
};