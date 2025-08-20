import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder, clearOrderSuccess, fetchCart } from '../features/cart/cartSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Checkout() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const cartItems = useSelector((state) => state.cart.items);
  const { loading, error, orderSuccess, lastOrder } = useSelector((state) => state.cart);
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState('');

  // Fetch cart on component mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Handle successful order
  useEffect(() => {
    if (orderSuccess && lastOrder) {
      // Redirect to order success page or show success message
      alert(`Order placed successfully! Order ID: ${lastOrder._id}`);
      dispatch(clearOrderSuccess());
      navigate('/orders'); // or wherever you want to redirect
    }
  }, [orderSuccess, lastOrder, dispatch, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    try {
      setLocalError('');

      // Validate form
      const requiredFields = [
        'fullName', 'email', 'phone', 'addressLine1', 
        'city', 'state', 'postalCode', 'country'
      ];

      for (let field of requiredFields) {
        if (!formData[field]?.trim()) {
          const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
          toast.error(`Please enter ${fieldName}`);
          return;
        }
      }

      if (!paymentMethod) {
        toast.error('Please select a payment method');
        return;
      }

      if (paymentMethod === 'card') {
        const cardRequired = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
        for (let field of cardRequired) {
          if (!cardDetails[field]?.trim()) {
            toast.error(`Please enter ${field}`);
            return;
          }
        }
      }

      // Fetch updated cart
      const response = await dispatch(fetchCart()).unwrap();
      const updatedCartItems = response.items;

      if (!updatedCartItems || updatedCartItems.length === 0) {
        toast.error('Your cart is empty. Please add items before placing an order.');
        return;
      }

      const total = updatedCartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const orderData = {
        items: updatedCartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        totalAmount: total,
        paymentMethod,
        address: { ...formData },
      };

      await dispatch(placeOrder(orderData)).unwrap();
      toast.success('Order placed successfully!');
      navigate('/orders');

    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Failed to place order. Please try again.');
      setLocalError('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Secure Checkout
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Empty Cart State */}
        {cartItems?.length === 0 && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl sm:text-7xl mb-6 animate-bounce">🛒</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 text-base sm:text-lg">Add some amazing items to your cart before proceeding to checkout.</p>
              <button 
                onClick={() => navigate('/products')}
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* Checkout Form */}
        {cartItems?.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Form Section */}
            <div className="xl:col-span-2 space-y-6 sm:space-y-8">
              {/* Billing Details */}
              <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-white border-opacity-20 rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center mb-6 sm:mb-8">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-bold mr-4 shadow-lg">
                    1
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Billing Details</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name*"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-base sm:text-lg bg-white bg-opacity-80 backdrop-blur-sm hover:border-gray-300"
                    />
                  </div>
                  
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address*"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-base sm:text-lg bg-white bg-opacity-80 backdrop-blur-sm hover:border-gray-300"
                  />
                  
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number*"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-base sm:text-lg bg-white bg-opacity-80 backdrop-blur-sm hover:border-gray-300"
                  />
                  
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      name="addressLine1"
                      placeholder="Address Line 1*"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-base sm:text-lg bg-white bg-opacity-80 backdrop-blur-sm hover:border-gray-300"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      name="addressLine2"
                      placeholder="Address Line 2 (optional)"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-base sm:text-lg bg-white bg-opacity-80 backdrop-blur-sm hover:border-gray-300"
                    />
                  </div>
                  
                  <input
                    type="text"
                    name="city"
                    placeholder="City*"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-base sm:text-lg bg-white bg-opacity-80 backdrop-blur-sm hover:border-gray-300"
                  />
                  
                  <input
                    type="text"
                    name="state"
                    placeholder="State / Province*"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-base sm:text-lg bg-white bg-opacity-80 backdrop-blur-sm hover:border-gray-300"
                  />
                  
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal / ZIP Code*"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-base sm:text-lg bg-white bg-opacity-80 backdrop-blur-sm hover:border-gray-300"
                  />
                  
                  <input
                    type="text"
                    name="country"
                    placeholder="Country*"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-base sm:text-lg bg-white bg-opacity-80 backdrop-blur-sm hover:border-gray-300"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-white border-opacity-20 rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center mb-6 sm:mb-8">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-bold mr-4 shadow-lg">
                    2
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Credit/Debit Card */}
                  <label className={`group border-2 rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    paymentMethod === 'card' 
                      ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg ring-4 ring-indigo-100' 
                      : 'border-gray-200 hover:border-indigo-300 hover:shadow-md bg-white bg-opacity-60'
                  }`}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-4 w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="font-bold text-gray-800 text-lg group-hover:text-indigo-700 transition-colors">💳 Credit/Debit Card</div>
                        <div className="text-sm text-gray-600 mt-1">Visa, MasterCard, RuPay</div>
                      </div>
                    </div>
                  </label>

                  {/* UPI */}
                  <label className={`group border-2 rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    paymentMethod === 'upi' 
                      ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg ring-4 ring-indigo-100' 
                      : 'border-gray-200 hover:border-indigo-300 hover:shadow-md bg-white bg-opacity-60'
                  }`}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-4 w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="font-bold text-gray-800 text-lg group-hover:text-indigo-700 transition-colors">📱 UPI</div>
                        <div className="text-sm text-gray-600 mt-1">PhonePe, GPay, Paytm</div>
                      </div>
                    </div>
                  </label>

                  {/* Net Banking */}
                  <label className={`group border-2 rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    paymentMethod === 'netbanking' 
                      ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg ring-4 ring-indigo-100' 
                      : 'border-gray-200 hover:border-indigo-300 hover:shadow-md bg-white bg-opacity-60'
                  }`}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="netbanking"
                        checked={paymentMethod === 'netbanking'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-4 w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="font-bold text-gray-800 text-lg group-hover:text-indigo-700 transition-colors">🏦 Net Banking</div>
                        <div className="text-sm text-gray-600 mt-1">All major banks</div>
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label className={`group border-2 rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    paymentMethod === 'cod' 
                      ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg ring-4 ring-indigo-100' 
                      : 'border-gray-200 hover:border-indigo-300 hover:shadow-md bg-white bg-opacity-60'
                  }`}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-4 w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="font-bold text-gray-800 text-lg group-hover:text-indigo-700 transition-colors">💰 Cash on Delivery</div>
                        <div className="text-sm text-gray-600 mt-1">Pay when you receive</div>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Card Details - Show only when card is selected */}
                {paymentMethod === 'card' && (
                  <div className="mt-8 p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 animate-slideDown">
                    <h3 className="font-bold text-gray-800 mb-6 text-xl flex items-center">
                      <span className="mr-2">🔒</span>
                      Secure Card Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="Card Number*"
                          value={cardDetails.cardNumber}
                          onChange={handleCardChange}
                          maxLength="19"
                          className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-base sm:text-lg bg-white hover:border-gray-300"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          name="cardName"
                          placeholder="Cardholder Name*"
                          value={cardDetails.cardName}
                          onChange={handleCardChange}
                          className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-base sm:text-lg bg-white hover:border-gray-300"
                        />
                      </div>
                      <input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY*"
                        value={cardDetails.expiryDate}
                        onChange={handleCardChange}
                        maxLength="5"
                        className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-base sm:text-lg bg-white hover:border-gray-300"
                      />
                      <input
                        type="text"
                        name="cvv"
                        placeholder="CVV*"
                        value={cardDetails.cvv}
                        onChange={handleCardChange}
                        maxLength="3"
                        className="w-full p-4 sm:p-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-base sm:text-lg bg-white hover:border-gray-300"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {(localError || error) && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-2xl shadow-lg animate-shake">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">⚠️</span>
                    <span className="font-semibold">{localError || error}</span>
                  </div>
                </div>
              )}

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className={`w-full text-white text-lg sm:text-xl font-bold py-5 sm:py-6 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 hover:shadow-2xl'
                }`}
              >
                <div className="flex items-center justify-center">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      🚀 Complete Order - ₹{total}
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-white border-opacity-20 rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 h-fit sticky top-6 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
                <span className="mr-3">📋</span>
                Order Summary
              </h2>
              
              <div className="divide-y divide-gray-200 text-gray-700 mb-6">
                {cartItems.map((item, index) => (
                  <div key={item.product._id} className="flex justify-between items-center py-4 px-4 bg-white bg-opacity-60 rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-200 animate-slideIn mb-4" style={{animationDelay: `${index * 100}ms`}}>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 truncate text-base sm:text-lg">{item.product.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 text-lg sm:text-xl ml-4">₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t-2 border-gray-200 pt-6 space-y-4">
                <div className="flex justify-between text-gray-700 text-base sm:text-lg">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{total}</span>
                </div>
                <div className="flex justify-between text-gray-700 text-base sm:text-lg">
                  <span>Shipping:</span>
                  <span className="font-semibold text-green-600">Free 🎉</span>
                </div>
                <div className="flex justify-between font-bold text-xl sm:text-2xl text-gray-900 pt-4 border-t-2 border-gray-300">
                  <span>Total:</span>
                  <span className="text-indigo-600">₹{total}</span>
                </div>
              </div>

              {/* Selected Payment Method Display */}
              {paymentMethod && (
                <div className="mt-8 p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 animate-slideDown">
                  <div className="text-sm font-medium text-indigo-700 mb-2">Payment Method:</div>
                  <div className="text-indigo-900 font-bold text-lg">
                    {paymentMethod === 'cod' ? '💰 Cash on Delivery' : 
                     paymentMethod === 'upi' ? '📱 UPI' :
                     paymentMethod === 'netbanking' ? '🏦 Net Banking' : '💳 Credit/Debit Card'}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-10px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(10px);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.6s ease-out forwards;
        }
        
        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
        
        @media (max-width: 640px) {
          .text-3xl { font-size: 2rem; }
          .text-4xl { font-size: 2.5rem; }
          .text-5xl { font-size: 3rem; }
        }
        
        @media (max-width: 480px) {
          .rounded-3xl { border-radius: 1.5rem; }
          .p-6 { padding: 1rem; }
          .gap-6 { gap: 1rem; }
        }
        
        @media (max-width: 320px) {
          .p-4 { padding: 0.75rem; }
          .gap-4 { gap: 0.75rem; }
          .text-lg { font-size: 1rem; }
          .text-xl { font-size: 1.125rem; }
        }
        
        input:focus {
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
        
        button:active {
          transform: scale(0.98);
        }
        
        .sticky {
          position: sticky;
        }
        
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}