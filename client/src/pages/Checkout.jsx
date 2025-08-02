import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrder } from '../features/cart/cartSlice';

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

  const cartItems = useSelector((state) => state.cart.items);
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const dispatch = useDispatch();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    const {
      fullName, email, phone, addressLine1, city, state, postalCode, country,
    } = formData;

    if (
      !fullName || !email || !phone || !addressLine1 ||
      !city || !state || !postalCode || !country
    ) {
      setError('Please fill all the required fields.');
      return;
    }

    setError('');
    dispatch(placeOrder({ address: formData }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 lg:p-14 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Billing Form */}
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Billing Details</h2>

          <div className="space-y-5">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name*"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address*"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number*"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="text"
              name="addressLine1"
              placeholder="Address Line 1*"
              value={formData.addressLine1}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="text"
              name="addressLine2"
              placeholder="Address Line 2 (optional)"
              value={formData.addressLine2}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City*"
                value={formData.city}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                name="state"
                placeholder="State / Province*"
                value={formData.state}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="postalCode"
                placeholder="Postal / ZIP Code*"
                value={formData.postalCode}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                name="country"
                placeholder="Country*"
                value={formData.country}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          <button
            onClick={handlePlaceOrder}
            className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-3 rounded-xl shadow transition"
          >
            Place Order & Proceed to Payment
          </button>
        </div>

        {/* Cart Summary */}
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 h-fit">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Order Summary</h2>
          <div className="divide-y divide-gray-200 text-gray-700">
            {cartItems.map((item) => (
              <div key={item.product._id} className="flex justify-between py-2">
                <span>{item.product.name} × {item.quantity}</span>
                <span>₹{item.product.price * item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between font-semibold text-lg pt-4">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
