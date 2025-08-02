const Product = require('../models/product');

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

//add product
exports.addProduct = async (req, res) => {
  try {
    let { name, price, description, category, stock } = req.body;
    // Ensure price and stock are numbers
    price = Number(price);
    stock = stock !== undefined ? Number(stock) : 0;
    const mainImage = req.files['mainImage'] ? `/uploads/Products/${req.files['mainImage'][0].filename}` : '';
    const gallery = req.files['gallery'] ? req.files['gallery'].map(f => `/uploads/Products/${f.filename}`) : [];
    const product = await Product.create({ name, price, description, category, stock, mainImage, gallery });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
//delete product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Edit product
exports.editProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body;
    let updateData = { name, price, description, category, stock };

    // Handle main image update
    if (req.files && req.files['mainImage']) {
      updateData.mainImage = `/uploads/Products/${req.files['mainImage'][0].filename}`;
    }

    // Handle gallery update (append new images to existing gallery)
    if (req.files && req.files['gallery']) {
      const newGallery = req.files['gallery'].map(f => `/uploads/Products/${f.filename}`);
      // Fetch current gallery and append new images
      const product = await Product.findById(req.params.id);
      updateData.gallery = product.gallery.concat(newGallery);
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
};

//remove image from gallery

exports.removeGalleryImage = async (req, res) => {
  try {
    const { id } = req.params; // product id
    const { imageUrl } = req.body; // image path to remove

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.gallery = product.gallery.filter(img => img !== imageUrl);
    await product.save();

    res.json({ message: 'Image removed', gallery: product.gallery });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove image', error: err.message });
  }
};