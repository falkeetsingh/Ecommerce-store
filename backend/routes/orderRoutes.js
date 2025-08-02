const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const orderController = require('../controllers/orderController');
const admin = require('../middleware/admin');

router.post('/', auth, orderController.placeOrder);
router.get('/', auth, orderController.getOrders);
router.get('/all',auth, admin, orderController.getAllOrders);
router.patch('/:id/status', auth, admin, orderController.updateOrderStatus); 

module.exports = router;