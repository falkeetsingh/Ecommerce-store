import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart, updateCartItem } from '../features/cart/cartSlice';
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaShoppingBag, FaMinus, FaPlus } from 'react-icons/fa';

const Cart = () => {
  const dispatch = useDispatch();
  const { items: cartItems, loading, error, orderSuccess } = useSelector(state => state.cart);
  const [localQuantities, setLocalQuantities] = useState({});
  const [showRemoveMsg, setShowRemoveMsg] = useState(false);
  const [updating, setUpdating] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    const quantities = {};
    cartItems.forEach(item => {
      quantities[item.product._id] = item.quantity;
    });
    setLocalQuantities(quantities);
  }, [cartItems]);

  useEffect(() => {
    if (showRemoveMsg) {
      const timer = setTimeout(() => setShowRemoveMsg(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showRemoveMsg]);

  const removeItem = (id) => {
    dispatch(removeFromCart({ productId: id }));
    setShowRemoveMsg(true);
  };

  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const debouncedUpdate = debounce(async (id, qty) => {
    await dispatch(updateCartItem({ productId: id, quantity: qty }));
    setUpdating(prev => ({ ...prev, [id]: false }));
  }, 300);

  const handleQtyChange = (id, change) => {
    const newQty = localQuantities[id] + change;
    if (newQty < 1) return;

    setLocalQuantities(prev => ({ ...prev, [id]: newQty }));
    setUpdating(prev => ({ ...prev, [id]: true }));
    debouncedUpdate(id, newQty);
  };

  const total = Object.entries(localQuantities).reduce((acc, [id, qty]) => {
    const item = cartItems.find(i => i.product._id === id);
    if (!item || !item.product.price) return acc;
    return acc + item.product.price * qty;
  }, 0);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300 text-lg">Loading your cart...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <p className="text-red-600 dark:text-red-400 text-xl font-semibold">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg">
              <FaShoppingBag className="text-white text-2xl" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Your Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {/* Success/Remove Messages */}
        <div className="space-y-4 mb-6">
          {orderSuccess && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-2xl text-center font-semibold shadow-lg transform animate-pulse">
              <span className="text-xl mr-2">✅</span>
              Order placed successfully!
            </div>
          )}
          {showRemoveMsg && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-2xl text-center font-semibold shadow-lg transform animate-pulse">
              <span className="text-xl mr-2">🗑️</span>
              Item removed from cart.
            </div>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 max-w-lg mx-auto">
              <div className="text-8xl mb-6 opacity-50">🛒</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="xl:col-span-2 space-y-4 lg:space-y-6">
              {cartItems.map(item => {
                const id = item.product._id;
                const quantity = localQuantities[id] || 1;
                const itemTotal = item.product.price * quantity;

                return (
                  <div 
                    key={id} 
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="p-4 sm:p-6 lg:p-8">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0 mx-auto sm:mx-0">
                          <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner">
                            {item.product.image ? (
                              <img 
                                src={item.product.image} 
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => e.target.src = '/fallback.jpg'}
                              />
                            ) : (
                              <span className="text-4xl">📦</span>
                            )}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-2 leading-tight">
                            {item.product.name}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-1">
                              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                ₹{item.product.price}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Total: ₹{itemTotal.toLocaleString()}
                              </p>
                            </div>

                            {/* Quantity Controls & Remove */}
                            <div className="flex items-center justify-center sm:justify-end gap-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-2xl p-2 shadow-inner">
                                <button
                                  onClick={() => handleQtyChange(id, -1)}
                                  disabled={quantity === 1 || updating[id]}
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                                    quantity === 1 || updating[id]
                                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                                      : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 shadow-sm hover:shadow-md'
                                  }`}
                                >
                                  <FaMinus className="text-sm" />
                                </button>
                                
                                <div className="w-12 text-center font-bold text-gray-800 dark:text-white relative">
                                  {updating[id] ? (
                                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                  ) : (
                                    quantity
                                  )}
                                </div>
                                
                                <button
                                  onClick={() => handleQtyChange(id, 1)}
                                  disabled={updating[id]}
                                  className="w-10 h-10 rounded-xl bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                                >
                                  <FaPlus className="text-sm" />
                                </button>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() => removeItem(id)}
                                className="w-10 h-10 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-700 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md group"
                                title="Remove item"
                              >
                                <FaTrashAlt className="text-sm group-hover:scale-110 transition-transform duration-200" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary - Sticky on larger screens */}
            <div className="xl:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 sticky top-8">
                <div className="p-6 lg:p-8">
                  {/* Summary Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <span className="text-white text-xl">💰</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                      Order Summary
                    </h3>
                  </div>

                  {/* Summary Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Items ({cartItems.length})</span>
                      <span className="font-semibold text-gray-800 dark:text-white">
                        ₹{isNaN(total) ? 0 : total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">FREE</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-t-2 border-gray-200 dark:border-gray-600">
                      <span className="text-xl font-bold text-gray-800 dark:text-white">Total</span>
                      <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        ₹{isNaN(total) ? 0 : total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-500"
                    onClick={() => navigate("/checkout")}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Proceed to Checkout
                      <span className="text-xl">🚀</span>
                    </span>
                  </button>

                  {/* Continue Shopping Link */}
                  <button
                    onClick={() => navigate('/')}
                    className="w-full mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium py-2 transition-colors duration-200"
                  >
                    ← Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;