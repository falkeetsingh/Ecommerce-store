const Product = require('../models/product');
const { deleteFromCloudinary } = require('../config/cloudinary');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { search, category, min, max } = req.query;
    let filter = {};

    if (category) {
      if (Array.isArray(category)) {
        filter.category = { $in: category };
      } else {
        filter.category = category;
      }
    }

    if (min || max) filter.price = {};
    if (min) filter.price.$gte = Number(min);
    if (max) filter.price.$lte = Number(max);

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add product with Cloudinary
exports.addProduct = async (req, res) => {
  try {
    let { name, price, description, category, stock } = req.body;
    
    // Ensure price and stock are numbers
    price = Number(price);
    stock = stock !== undefined ? Number(stock) : 0;

    // Get image URLs from Cloudinary upload
    const mainImage = req.files && req.files['mainImage'] ? 
      req.files['mainImage'][0].path : '';
    
    const gallery = req.files && req.files['gallery'] ? 
      req.files['gallery'].map(file => file.path) : [];

    // Store image metadata for easier management
    const mainImageData = req.files && req.files['mainImage'] ? {
      url: req.files['mainImage'][0].path,
      publicId: req.files['mainImage'][0].public_id
    } : null;

    const galleryData = req.files && req.files['gallery'] ? 
      req.files['gallery'].map(file => ({
        url: file.path,
        publicId: file.public_id
      })) : [];

    const product = await Product.create({ 
      name, 
      price, 
      description, 
      category, 
      stock, 
      mainImage,
      gallery,
      mainImageData,
      galleryData
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete product with Cloudinary cleanup
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete images from Cloudinary
    const deletePromises = [];
    
    if (product.mainImageData && product.mainImageData.publicId) {
      deletePromises.push(deleteFromCloudinary(product.mainImageData.publicId));
    }
    
    if (product.galleryData && product.galleryData.length > 0) {
      product.galleryData.forEach(img => {
        if (img.publicId) {
          deletePromises.push(deleteFromCloudinary(img.publicId));
        }
      });
    }

    // Wait for all deletions to complete
    await Promise.all(deletePromises);

    // Delete product from database
    await Product.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Product and images deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Edit product with Cloudinary
exports.editProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body;
    let updateData = { name, price, description, category, stock };

    // Handle main image update
    if (req.files && req.files['mainImage']) {
      const oldProduct = await Product.findById(req.params.id);
      
      // Delete old main image from Cloudinary if it exists
      if (oldProduct.mainImageData && oldProduct.mainImageData.publicId) {
        await deleteFromCloudinary(oldProduct.mainImageData.publicId);
      }

      updateData.mainImage = req.files['mainImage'][0].path;
      updateData.mainImageData = {
        url: req.files['mainImage'][0].path,
        publicId: req.files['mainImage'][0].public_id
      };
    }

    // Handle gallery update (append new images to existing gallery)
    if (req.files && req.files['gallery']) {
      const product = await Product.findById(req.params.id);
      const newGallery = req.files['gallery'].map(file => file.path);
      const newGalleryData = req.files['gallery'].map(file => ({
        url: file.path,
        publicId: file.public_id
      }));

      updateData.gallery = [...(product.gallery || []), ...newGallery];
      updateData.galleryData = [...(product.galleryData || []), ...newGalleryData];
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
};

// Remove image from gallery with Cloudinary cleanup
exports.removeGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Find the image data to get public_id
    const imageIndex = product.gallery.findIndex(img => img === imageUrl);
    if (imageIndex === -1) {
      return res.status(404).json({ message: 'Image not found in gallery' });
    }

    // Delete from Cloudinary
    if (product.galleryData && product.galleryData[imageIndex] && product.galleryData[imageIndex].publicId) {
      await deleteFromCloudinary(product.galleryData[imageIndex].publicId);
    }

    // Remove from database arrays
    product.gallery.splice(imageIndex, 1);
    if (product.galleryData) {
      product.galleryData.splice(imageIndex, 1);
    }

    await product.save();

    res.json({ message: 'Image removed successfully', gallery: product.gallery });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove image', error: err.message });
  }
};