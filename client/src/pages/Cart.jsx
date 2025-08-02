import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart, updateCartItem } from '../features/cart/cartSlice';
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from 'react-icons/fa';

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

  if (loading) return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-bold mb-8 text-center text-neutral-800">Your Shopping Cart</h2>

      {orderSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm text-center">
          Order placed successfully!
        </div>
      )}
      {showRemoveMsg && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
          Item removed from cart.
        </div>
      )}

      {cartItems.length === 0 ? (
        <p className="text-center text-neutral-500 text-lg">Your cart is currently empty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map(item => {
              const id = item.product._id;
              const quantity = localQuantities[id] || 1;

              return (
                <div key={id} className="flex items-center justify-between bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{item.product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      ₹{item.product.price} x {quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQtyChange(id, -1)}
                      disabled={quantity === 1 || updating[id]}
                      className={`w-8 h-8 text-lg rounded-full text-gray-700 border ${
                        quantity === 1 || updating[id]
                          ? 'bg-gray-100 cursor-not-allowed'
                          : 'hover:bg-gray-200'
                      }`}
                    >
                      −
                    </button>
                    <span className="w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => handleQtyChange(id, 1)}
                      disabled={updating[id]}
                      className="w-8 h-8 text-lg rounded-full text-gray-700 border hover:bg-gray-200 disabled:opacity-50"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeItem(id)}
                      className="text-red-500 hover:text-red-600 ml-3"
                      title="Remove item"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 bg-white p-6 rounded-2xl shadow-md border border-gray-100 text-right">
            <h4 className="text-2xl font-semibold text-neutral-800 mb-4">
              Total: ₹{isNaN(total) ? 0 : total}
            </h4>
            <button
              className="bg-neutral-800 text-white px-6 py-3 rounded-xl hover:bg-neutral-700 transition"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
