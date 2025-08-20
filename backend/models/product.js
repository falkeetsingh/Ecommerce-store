const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    price: { 
        type: Number, 
        required: true 
    },
    mainImage: { 
        type: String  // Cloudinary URL
    },
    mainImageData: {
        url: String,
        publicId: String  // For deletion from Cloudinary
    },
    gallery: [{
        type: String  // Array of Cloudinary URLs
    }],
    galleryData: [{
        url: String,
        publicId: String  // For deletion from Cloudinary
    }],
    category: { 
        type: String 
    },
    stock: { 
        type: Number, 
        default: 0 
    },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);