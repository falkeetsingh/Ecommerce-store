import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice';
import { Link } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items: wishlist, loading, error } = useSelector(state => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  if (loading) return <div>Loading wishlist...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <div>No items in wishlist.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map(product => (
            <div key={product._id} className="bg-white rounded shadow p-4 flex flex-col">
              <img
                src={product.mainImage ? BACKEND_URL + product.mainImage : '/default-product.png'}
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
              <div className="text-indigo-600 font-bold mb-2">₹{product.price}</div>
              <button
                onClick={() => dispatch(removeFromWishlist(product._id))}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
              <Link to={`/products/${product._id}`} className="text-blue-600 mt-2 underline">
                View Product
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;