import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice';
import { Link } from 'react-router-dom';
import { FiImage, FiHeart, FiTrash2, FiEye, FiShoppingBag } from 'react-icons/fi';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items: wishlist, loading, error } = useSelector(state => state.wishlist);
  const [brokenImages, setBrokenImages] = useState({});

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error('Failed to load wishlist.');
  }, [error]);

  const handleImageError = (id) => {
    setBrokenImages(prev => ({ ...prev, [id]: true }));
  };

  const getImageUrl = (product) => {
    const url = product.mainImage;
    if (!url) return null;
    if (url.startsWith('http')) return url; // Cloudinary or external URL
    return `${BACKEND_URL}${url}`; // Backend image
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="flex items-center justify-center mb-4">
            <FiHeart className="text-red-500 text-3xl mr-3" />
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <p className="text-gray-600 text-sm lg:text-base max-w-2xl mx-auto">
            Keep track of your favorite items and never miss out on what you love
          </p>
          {wishlist.length > 0 && (
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
              <FiShoppingBag className="mr-2 text-xs" />
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
            </div>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 lg:py-24">
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 max-w-md mx-auto text-center border border-gray-100">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <FiHeart className="text-4xl text-gray-400" />
              </div>
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Start adding items you love to keep track of them and shop later
              </p>
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <FiShoppingBag className="mr-2" />
                Explore Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {wishlist.map(product => {
              const isBroken = brokenImages[product._id];
              const imageUrl = getImageUrl(product);

              return (
                <div
                  key={product._id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    {isBroken || !imageUrl ? (
                      <div className="w-full h-48 sm:h-56 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                        <FiImage className="text-5xl" />
                      </div>
                    ) : (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={() => handleImageError(product._id)}
                      />
                    )}
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <Link
                          to={`/products/${product._id}`}
                          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
                          title="View Product"
                        >
                          <FiEye className="text-gray-700" />
                        </Link>
                      </div>
                    </div>

                    {/* Wishlist indicator */}
                    <div className="absolute top-3 right-3 p-2 bg-red-500 rounded-full shadow-lg">
                      <FiHeart className="text-white text-sm fill-current" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 lg:p-6">
                    <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                      {product.name}
                    </h2>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        ₹{product.price}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                      <Link
                        to={`/products/${product._id}`}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-xl font-medium text-center hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                      >
                        <span className="flex items-center justify-center">
                          <FiEye className="mr-2 text-sm" />
                          View
                        </span>
                      </Link>
                      
                      <button
                        onClick={() => dispatch(removeFromWishlist(product._id))}
                        className="bg-red-50 text-red-600 py-2 px-4 rounded-xl font-medium hover:bg-red-100 transition-all duration-200 transform hover:scale-105 border border-red-200"
                        title="Remove from wishlist"
                      >
                        <span className="flex items-center justify-center">
                          <FiTrash2 className="text-sm sm:mr-2" />
                          <span className="hidden sm:inline">Remove</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  );
};

export default Wishlist;