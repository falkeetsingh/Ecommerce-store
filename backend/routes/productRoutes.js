const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, getProductById, deleteProduct, editProduct, removeGalleryImage, getProductsByCategory } = require('../controllers/productController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post(
    '/',
    auth,
    admin,
    upload.fields([
      { name: 'mainImage', maxCount: 1 },
      { name: 'gallery', maxCount: 10 }
    ]),
    addProduct
  );
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.delete('/:id',auth, admin, deleteProduct);
router.put(
  '/:id',
  auth,
  admin,
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'gallery', maxCount: 10 }
  ]),
  editProduct
);
router.patch('/:id/remove-gallery-image', auth, admin, removeGalleryImage);

module.exports = router;