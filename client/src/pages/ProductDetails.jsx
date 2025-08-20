import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { fetchProductById } from '../features/products/productSlice';
import { FaStar, FaHeart } from 'react-icons/fa';
import { addToCart } from '../features/cart/cartSlice';
import { fetchReviews, addReview } from '../features/review/reviewSlice';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../features/wishlist/wishlistSlice';
import { toast } from 'react-toastify';


export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, loading, error } = useSelector(state => state.products);

  const wishlist = useSelector((state) => state.wishlist?.items ?? []);
  const cleanWishlist = wishlist.filter(item => item && item._id);
  const isWishlisted = product && cleanWishlist.some(item => item._id === product._id);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewImage, setReviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');

  const handleReviewImage = (e) => setReviewImage(e.target.files[0]);

  const { reviews, loading: reviewsLoading, error: reviewsError } = useSelector(state => state.review);

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchReviews(id));
    dispatch(fetchWishlist());
  }, [dispatch, id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product._id, quantity: 1 }))
      .unwrap()
      .then(() => {
        toast.success('Added to cart!');
      })
      .catch(() => {
        toast.error('Failed to add to cart');
      });
  };

  const handleSubmitReview = async () => {
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }
    const reviewData = { productId: id, rating, text: reviewText, reviewImage };

    try {
      await dispatch(addReview(reviewData)).unwrap();
      setRating(0);
      setReviewText('');
      setReviewImage(null);
      toast.success('Review submitted!');
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id))
        .unwrap()
        .then(() => toast.info('Removed from wishlist'))
        .catch(() => toast.error('Failed to remove from wishlist'));
    } else {
      dispatch(addToWishlist(product._id))
        .unwrap()
        .then(() => toast.success('Added to wishlist'))
        .catch(() => toast.error('Failed to add to wishlist'));
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300 text-lg">Loading product details...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <p className="text-red-600 dark:text-red-400 text-xl font-semibold">{error}</p>
      </div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <p className="text-gray-600 dark:text-gray-300 text-xl">Product not found</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-7xl">
        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative group overflow-hidden rounded-3xl bg-white dark:bg-gray-800 p-4 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10"></div>
              <img
                src={selectedImage || product.mainImage}
                alt={product.name}
                onError={(e) => (e.target.src = '/fallback.jpg')}
                className="relative z-10 rounded-2xl w-full object-cover h-64 sm:h-80 lg:h-96 xl:h-[500px] transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {(product.mainImage || product.gallery?.length > 0) && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.mainImage && (
                  <div className="flex-shrink-0">
                    <img
                      src={product.mainImage}
                      alt="Main"
                      className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl cursor-pointer border-2 transition-all duration-300 hover:scale-110 ${
                        selectedImage === '' 
                          ? 'border-indigo-500 shadow-lg shadow-indigo-500/30' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300'
                      }`}
                      onClick={() => setSelectedImage('')}
                    />
                  </div>
                )}
                {product.gallery?.map((img, idx) => (
                  <div key={idx} className="flex-shrink-0">
                    <img
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl cursor-pointer border-2 transition-all duration-300 hover:scale-110 ${
                        selectedImage === img 
                          ? 'border-indigo-500 shadow-lg shadow-indigo-500/30' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300'
                      }`}
                      onClick={() => setSelectedImage(img)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6 lg:pl-8">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                className="group relative flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-2xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-500"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Add to Cart
                  <span className="text-xl group-hover:animate-bounce">🛒</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button
                onClick={handleWishlistToggle}
                className={`group relative flex-1 sm:flex-initial px-6 py-4 rounded-2xl font-semibold text-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 ${
                  isWishlisted
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 focus:ring-red-300'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 focus:ring-gray-300'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <FaHeart className={`transition-colors duration-300 ${isWishlisted ? 'text-white' : 'text-gray-400 group-hover:text-red-500'}`} />
                  <span className="hidden sm:inline">
                    {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Review Submission Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8 mb-12 border border-gray-100 dark:border-gray-700">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <span className="text-white text-xl">✍️</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                Share Your Experience
              </h2>
            </div>
            
            {/* Rating Stars */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`w-8 h-8 cursor-pointer transition-all duration-200 hover:scale-110 ${
                      star <= rating 
                        ? 'text-yellow-400 drop-shadow-lg' 
                        : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
                {rating > 0 && (
                  <span className="ml-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {rating} star{rating !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Review Text */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Tell others about your experience with this product..."
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none resize-none transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                rows={4}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Add Photos (Optional)
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <label className="relative cursor-pointer">
                  <input 
                    type="file" 
                    onChange={handleReviewImage} 
                    accept="image/*" 
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors duration-300">
                    <span className="text-2xl">📷</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Choose Image
                    </span>
                  </div>
                </label>
                
                {reviewImage && (
                  <div className="relative group">
                    <img
                      src={URL.createObjectURL(reviewImage)}
                      alt="Review Preview"
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-600"
                    />
                    <button
                      onClick={() => setReviewImage(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitReview}
              disabled={reviewsLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {reviewsLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </span>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        </div>

        {/* Reviews Display Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-xl">💬</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              Customer Reviews
            </h2>
          </div>

          {reviewsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading reviews...</p>
            </div>
          ) : reviewsError ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
              <p className="text-red-600 dark:text-red-400 font-medium">{reviewsError}</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">No reviews yet.</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {reviews.map((review) => (
                <div 
                  key={review._id} 
                  className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Review Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {review.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {review.user?.name || 'Anonymous User'}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            {review.rating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
                    {review.text}
                  </p>

                  {/* Review Image */}
                  {review.image && (
                    <div className="mt-4">
                      <img
                        src={review.image}
                        alt="Review"
                        className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl shadow-md border border-gray-200 dark:border-gray-600 hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onError={(e) => (e.target.src = '/fallback.jpg')}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}