const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/product');
const sendEmail = require('../utils/sendEmail');

// Helper function to get card type from card number
const getCardType = (cardNumber) => {
    const num = cardNumber.replace(/\s/g, '');
    if (num.startsWith('4')) return 'Visa';
    if (num.startsWith('5') || num.startsWith('2')) return 'Mastercard';
    if (num.startsWith('3')) return 'American Express';
    if (num.startsWith('6')) return 'Discover';
    return 'Unknown';
};

// Helper function to format order items for email
const formatOrderItems = (items) => {
    return items.map(item => 
        `<tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.product.price}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.product.price * item.quantity}</td>
        </tr>`
    ).join('');
};

// Helper function to get payment method display name
const getPaymentMethodName = (method) => {
    const methods = {
        'card': 'Credit/Debit Card',
        'upi': 'UPI',
        'netbanking': 'Net Banking',
        'cod': 'Cash on Delivery'
    };
    return methods[method] || method;
};

//place an order
exports.placeOrder = async (req, res) => {
    try{
        
        const userId = req.user.id; // CHANGED FROM ._id to .id
        const { address, paymentMethod, cardDetails } = req.body;

        // Validate address fields
        const requiredFields = [
            'fullName', 'email', 'phone', 'addressLine1', 'city', 'state', 'postalCode', 'country'
        ];
        for (const field of requiredFields) {
            if (!address || !address[field]) {
                return res.status(400).json({ message: `Missing address field: ${field}` });
            }
        }

        // Validate payment method
        if (!paymentMethod) {
            return res.status(400).json({ message: 'Payment method is required' });
        }

        const validPaymentMethods = ['card', 'upi', 'netbanking', 'cod'];
        if (!validPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({ message: 'Invalid payment method' });
        }

        // Validate card details if card payment is selected
        if (paymentMethod === 'card') {
            if (!cardDetails || !cardDetails.cardNumber || !cardDetails.expiryDate || 
                !cardDetails.cvv || !cardDetails.cardName) {
                return res.status(400).json({ message: 'Card details are required for card payment' });
            }
        }

        const cart = await Cart.findOne({ user: userId }).populate('items.product'); // CHANGED FROM ._id to .id

        if(!cart || !cart.items || cart.items.length === 0){
            // Check if user has items in local storage/frontend that weren't synced
            return res.status(400).json({ 
                message: 'Cart is empty. Please add items to your cart before placing an order.',
            });
        }

        //calculate total price
        const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        // Prepare order data
        const orderData = {
            user: userId,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
            })),
            total,
            address,
            paymentMethod,
        };

        // Add card info if card payment (store only last 4 digits)
        if (paymentMethod === 'card' && cardDetails) {
            const cardNumber = cardDetails.cardNumber.replace(/\s/g, '');
            orderData.cardInfo = {
                lastFourDigits: cardNumber.slice(-4),
                cardType: getCardType(cardNumber)
            };
        }

        // Set payment status based on method
        if (paymentMethod === 'cod') {
            orderData.paymentStatus = 'pending'; // Will be completed on delivery
        } else {
            orderData.paymentStatus = 'pending'; // Will be updated when payment gateway is integrated
        }


        //create order
        const order = new Order(orderData);
        await order.save();
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (product) {
                product.stock = Math.max(0, product.stock - item.quantity); // Prevent negative stock
                await product.save();
            }
        }
        
        // Populate the order for email
        await order.populate('items.product');

        // Send confirmation email
        try {
            const paymentMethodName = getPaymentMethodName(paymentMethod);
            const orderItemsHtml = formatOrderItems(order.items);
            
            // Different email content based on payment method
            let paymentInfo = '';
            if (paymentMethod === 'cod') {
                paymentInfo = `
                    <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #856404; margin: 0 0 10px 0;">💰 Cash on Delivery</h3>
                        <p style="color: #856404; margin: 0;">Please keep ₹${order.total} ready in cash when our delivery executive arrives. You can also pay by card/UPI to the delivery person if available.</p>
                    </div>
                `;
            } else if (paymentMethod === 'card') {
                paymentInfo = `
                    <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #155724; margin: 0 0 10px 0;">💳 Card Payment</h3>
                        <p style="color: #155724; margin: 0;">Payment via ${orderData.cardInfo?.cardType} ending in ${orderData.cardInfo?.lastFourDigits}</p>
                        <p style="color: #155724; margin: 5px 0 0 0;"><small>Payment processing will be completed shortly.</small></p>
                    </div>
                `;
            } else {
                paymentInfo = `
                    <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #0c5460; margin: 0 0 10px 0;">💻 ${paymentMethodName}</h3>
                        <p style="color: #0c5460; margin: 0;">Payment processing will be completed shortly. You will receive a payment confirmation once processed.</p>
                    </div>
                `;
            }

            const emailHtml = `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                    <div style="background-color: #4f46e5; color: white; padding: 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px;">🎉 Order Confirmed!</h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for your purchase</p>
                    </div>
                    
                    <div style="padding: 30px; background-color: #f8f9fa;">
                        <div style="background-color: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                            <h2 style="color: #333; margin: 0 0 15px 0;">Order Details</h2>
                            <p><strong>Order ID:</strong> #${order._id}</p>
                            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                            <p><strong>Payment Method:</strong> ${paymentMethodName}</p>
                        </div>

                        ${paymentInfo}

                        <div style="background-color: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                            <h2 style="color: #333; margin: 0 0 15px 0;">Items Ordered</h2>
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="background-color: #f8f9fa;">
                                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
                                        <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
                                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
                                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${orderItemsHtml}
                                </tbody>
                            </table>
                            <div style="text-align: right; margin-top: 15px; padding-top: 15px; border-top: 2px solid #4f46e5;">
                                <h3 style="margin: 0; color: #4f46e5;">Total: ₹${order.total}</h3>
                            </div>
                        </div>

                        <div style="background-color: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                            <h2 style="color: #333; margin: 0 0 15px 0;">Delivery Address</h2>
                            <p style="margin: 0; line-height: 1.6;">
                                <strong>${order.address.fullName}</strong><br>
                                ${order.address.addressLine1}<br>
                                ${order.address.addressLine2 ? order.address.addressLine2 + '<br>' : ''}
                                ${order.address.city}, ${order.address.state} ${order.address.postalCode}<br>
                                ${order.address.country}<br>
                                <strong>Phone:</strong> ${order.address.phone}<br>
                                <strong>Email:</strong> ${order.address.email}
                            </p>
                        </div>

                        <div style="background-color: #e7f3ff; border: 1px solid #b3d7ff; padding: 20px; border-radius: 8px; text-align: center;">
                            <h3 style="color: #0066cc; margin: 0 0 10px 0;">📦 What's Next?</h3>
                            <p style="color: #0066cc; margin: 0;">We're preparing your order for shipment. You'll receive a tracking number once your order is dispatched.</p>
                            ${paymentMethod === 'cod' ? '<p style="color: #0066cc; margin: 10px 0 0 0;"><strong>Remember to keep cash ready for delivery!</strong></p>' : ''}
                        </div>

                        <div style="text-align: center; margin-top: 30px; color: #666;">
                            <p>Need help? Contact our support team</p>
                            <p style="margin: 0;"><small>This is an automated email. Please do not reply to this email.</small></p>
                        </div>
                    </div>
                </div>
            `;

            await sendEmail(
                address.email, // Use address email instead of user email
                `Order Confirmation - #${order._id}`,
                emailHtml
            );
        } catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError);
            // Continue processing - don't return response here
        }

        //clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json({ 
            message: 'Order placed successfully', 
            order: {
                _id: order._id,
                total: order.total,
                paymentMethod: order.paymentMethod,
                status: order.status,
                createdAt: order.createdAt
            }
        });
    } catch (error) {
        console.error('Order placement error:', error);
        res.status(500).json({ message: 'Failed to place order', error: error.message });
    }
}

//get user's orders
exports.getOrders = async (req, res) => {
    try{
        const userId = req.user.id; // CHANGED FROM ._id to .id
        const orders = await Order.find({ user: userId })
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
}

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user')
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch all orders', error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
            .populate('items.product');
            
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (status === 'cancelled') {
            for (const item of order.items) {
                const product = await Product.findById(item.product._id);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                }
            }
        }

        // Send status update email
        try {
            const statusMessages = {
                'confirmed': 'Your order has been confirmed and is being prepared.',
                'shipped': 'Great news! Your order has been shipped and is on its way.',
                'delivered': 'Your order has been successfully delivered. Thank you for shopping with us!',
                'cancelled': 'Your order has been cancelled. If you have any questions, please contact our support team.'
            };

            if (statusMessages[status]) {
                await sendEmail(
                    order.address.email,
                    `Order Update - #${order._id}`,
                    `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                        <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
                            <h1 style="margin: 0;">Order Status Update</h1>
                        </div>
                        <div style="padding: 30px; background-color: #f8f9fa;">
                            <div style="background-color: white; padding: 25px; border-radius: 8px;">
                                <h2>Order #${order._id}</h2>
                                <p><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
                                <p>${statusMessages[status]}</p>
                                <p><strong>Total:</strong> ₹${order.total}</p>
                            </div>
                        </div>
                    </div>`
                );
            }
        } catch (emailError) {
            console.error('Failed to send status update email:', emailError);
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status', error: error.message });
    }
};