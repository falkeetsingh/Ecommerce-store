const Cart = require('../models/Cart');
const Product = require('../models/product');

//get user's cart
exports.getCart = async(req,res)=>{
    try{
        const cart = await Cart.findOne({user: req.user.id}).populate('items.product');
        if(!cart) return res.json({items: []});
        res.json(cart);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

//add item to cart
exports.addToCart = async(req,res)=>{
    try{
        const {productId, quantity} = req.body;
        let cart = await Cart.findOne({user: req.user.id});

        if(!cart){
            cart = new Cart({user: req.user.id, items: []});
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if(itemIndex > -1){
            //updating the quantity
            cart.items[itemIndex].quantity += quantity;
        }else{
            //adding new item
            cart.items.push({product: productId, quantity});
        }

        await cart.save();
        const populatedCart = await cart.populate('items.product');
        res.json(populatedCart);

    }catch(error){
        res.status(500).json({message: error.message});
    }
};

//remove item from cart
exports.removeFromCart = async(req,res)=>{
    try{
        const {productId} = req.body;
        const cart = await Cart.findOne({user: req.user.id});
        if(!cart) return res.status(404).json({message: 'Cart not found!'});

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        const populatedCart = await cart.populate('items.product');
        res.json(populatedCart);

    }catch(error){
        res.status(500).json({message: error.message});
    }
};

//update item quantity
exports.updateCartItem = async(req,res)=>{
    try{
        const {productId, quantity} = req.body;
        const cart = await Cart.findOne({user: req.user.id});
        if(!cart) return res.status(404).json({message: 'Cart not found'});

        const item = cart.items.find(item => item.product.toString() === productId);
        if(!item) return res.status(404).json({message: 'Item not found'});

        item.quantity = quantity;
        await cart.save();
        const populatedCart = await cart.populate('items.product');
        res.json(populatedCart);

    }catch(error){
        res.status(500).json({message: error.message});
    }
};