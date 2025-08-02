const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directory exists before upload
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder;
    if (file.fieldname === 'mainImage' || file.fieldname === 'gallery') {
      folder = 'uploads/products/';
    } else if (file.fieldname === 'reviewImage') {
      folder = 'uploads/reviews/';
    } else {
      folder = 'uploads/userProfile/';
    }

    ensureDir(folder); // Auto-create folder if missing
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Add file size limits
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB limit
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits
});

module.exports = upload;
