const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/product');
const sendEmail = require('../utils/sendEmail');

//place an order
exports.placeOrder = async (req, res) => {
    try{
        const userId = req.user._id;
        const { address } = req.body;

        const requiredFields = [
            'fullName', 'email', 'phone', 'addressLine1', 'city', 'state', 'postalCode', 'country'
        ];
        for (const field of requiredFields) {
            if (!address[field]) {
                return res.status(400).json({ message: `Missing address field: ${field}` });
            }
        }

        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if(!cart || cart.items.length === 0){
            return res.status(400).json({ message: 'Cart is empty' });
        }

        //calculate total price
        const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        //create order
        const order = new Order({
            user: userId,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
            })),
            total,
            address,
        });

        await order.save();
        
        // Send confirmation email - don't return response on error
        try {
            await sendEmail(
              req.user.email,
              'Order Confirmation',
              `<h2>Thank you for your order!</h2>
               <p>Your order ID: ${order._id}</p>
               <p>Total: ₹${order.total}</p>
               <p>We will notify you when your order is shipped.</p>`
            );
        } catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError);
            // Continue processing - don't return response here
        }

        //clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Failed to place order', error: error.message });
    }
}

//get user's orders
exports.getOrders = async (req, res) => {
    try{
        const userId = req.user._id;
        const orders = await Order.find({ user: userId }).populate('items.product').sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
}

exports.getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find().populate('user').populate('items.product').sort({ createdAt: -1 });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch all orders', error: error.message });
    }
};


exports.updateOrderStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update order status', error: error.message });
    }
};