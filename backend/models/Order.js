const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true 
    }
});

const orderSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [orderItemSchema],
    total: { 
        type: Number, 
        required: true 
    },
    address: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String }, // optional
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    status: { 
        type: String, 
        default: 'pending' //delivered, pending, shipped, cancelled
    },                                                      
    createdAt: { type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Order', orderSchema);