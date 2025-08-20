// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

console.log('About to configure Cloudinary...');
console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);

// Configure Cloudinary - will be called when needed
const configureCloudinary = () => {
  if (!cloudinary.config().cloud_name) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  return cloudinary;
};

// Configure immediately
configureCloudinary();

console.log('Cloudinary configured!');

// Create storage configuration for different upload types
const createCloudinaryStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' }, // Limit max size
        { quality: 'auto' }, // Auto quality optimization
        { fetch_format: 'auto' } // Auto format selection
      ]
    },
  });
};

// File filter function
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Upload configurations for different types
const productUpload = multer({
  storage: createCloudinaryStorage('ecommerce/products'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const reviewUpload = multer({
  storage: createCloudinaryStorage('ecommerce/reviews'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const profileUpload = multer({
  storage: createCloudinaryStorage('ecommerce/profiles'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Direct upload function (without multer)
const uploadToCloudinary = async (buffer, folder, filename) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: `ecommerce/${folder}`,
        public_id: filename,
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
};

// Function to delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  productUpload,
  reviewUpload,
  profileUpload,
  uploadToCloudinary,
  deleteFromCloudinary
};