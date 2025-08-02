import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { fetchProductById } from '../features/products/productSlice';
import { FaStar, FaHeart } from 'react-icons/fa';
import { addToCart } from '../features/cart/cartSlice';
import { fetchReviews, addReview } from '../features/review/reviewSlice';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../features/wishlist/wishlistSlice';

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
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [showAdded, setShowAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
        setShowAdded(true);
        setTimeout(() => setShowAdded(false), 1500);
      });
  };

  const handleSubmitReview = async () => {
    if (!rating) return alert('Please select a rating');
    const reviewData = { productId: id, rating, text: reviewText, reviewImage };
    await dispatch(addReview(reviewData)).unwrap();
    setRating(0);
    setReviewText('');
    setReviewImage(null);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 1500);
  };

  const handleWishlistToggle = () => {
    isWishlisted ? dispatch(removeFromWishlist(product._id)) : dispatch(addToWishlist(product._id));
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-600 text-center py-12">{error}</div>;
  if (!product) return <div className="text-center py-12 text-gray-500">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Product Section */}
      <div className="grid md:grid-cols-2 gap-10 items-start bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6">
        <div>
          <img
            src={
              selectedImage
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${selectedImage}`
                : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.mainImage}`
            }
            alt={product.name}
            className="rounded-xl w-full object-cover max-h-[500px] shadow-md"
          />
          {(product.mainImage || product.gallery?.length > 0) && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {product.mainImage && (
                <img
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.mainImage}`}
                  alt="Main"
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    selectedImage === null ? 'border-indigo-500' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedImage(null)}
                />
              )}
              {product.gallery?.map((img, idx) => (
                <img
                  key={idx}
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img}`}
                  alt={`Gallery ${idx + 1}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    selectedImage === img ? 'border-indigo-500' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{product.name}</h1>
          <p className="text-gray-600 dark:text-gray-300">{product.description}</p>

          {showAdded && <div className="text-green-600">Added to cart!</div>}

          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition"
            >
              Add to Cart 🛒
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`px-6 py-3 rounded-full transition ${
                isWishlisted
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Review Submission */}
      <div className="mt-12 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Add Your Review</h2>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`w-5 h-5 cursor-pointer ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review..."
          className="w-full p-3 border rounded-lg focus:ring-indigo-300 focus:outline-none resize-none"
          rows={4}
        />
        <div>
          <input type="file" onChange={handleReviewImage} accept="image/*" />
          {reviewImage && (
            <img
              src={URL.createObjectURL(reviewImage)}
              alt="Review Preview"
              className="mt-3 w-28 h-28 object-cover rounded-lg"
            />
          )}
        </div>
        <button
          onClick={handleSubmitReview}
          className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition"
          disabled={reviewsLoading}
        >
          {reviewsLoading ? 'Submitting...' : 'Submit Review'}
        </button>
        {reviewSuccess && <div className="text-green-500">Review submitted!</div>}
        {reviewsError && <div className="text-red-600">{reviewsError}</div>}
      </div>

      {/* Display Reviews */}
      <div className="mt-12 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Customer Reviews</h2>
        {reviewsLoading ? (
          <div>Loading reviews...</div>
        ) : reviewsError ? (
          <div className="text-red-600">{reviewsError}</div>
        ) : reviews.length === 0 ? (
          <div className="text-gray-600">No reviews yet.</div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white dark:bg-gray-900 border p-4 rounded-xl shadow">
              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`w-4 h-4 mr-1 ${
                      star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">{review.user?.name}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-200">{review.text}</p>
              {review.image && (
                <img
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${review.image}`}
                  alt="Review"
                  className="mt-2 w-28 h-28 object-cover rounded-lg"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
