import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  // BiArrowLeft, 
  BiEdit, 
  BiImage, 
  BiTrash, 
  BiCheck, 
  BiDollar,
  BiPackage,
  BiCategory,
  BiCube,
  BiImageAdd,
  BiSave,
  BiLoader
} from 'react-icons/bi';

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [brokenImages, setBrokenImages] = useState({});
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/api/products/${id}`);
        setProduct(res.data);
        setName(res.data.name);
        setPrice(res.data.price);
        setDescription(res.data.description);
        setCategory(res.data.category);
        setStock(res.data.stock);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('stock', stock);
    if (mainImage) formData.append('mainImage', mainImage);
    for (let i = 0; i < gallery.length; i++) {
      formData.append('gallery', gallery[i]);
    }

    try {
      await axiosInstance.put(`/api/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
      setTimeout(() => navigate('/admin/dashboard/products'), 1500);
    } catch {
      alert('Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveGalleryImage = async (imgUrl) => {
    try {
      const res = await axiosInstance.patch(`/api/products/${id}/remove-gallery-image`, { imageUrl: imgUrl });
      setProduct(prev => ({
        ...prev,
        gallery: res.data.gallery
      }));
    } catch {
      alert('Failed to remove image');
    }
  };

  const handleImageError = (imageId) => {
    setBrokenImages(prev => ({ ...prev, [imageId]: true }));
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath; // Cloudinary or external URL
    return imagePath.startsWith('/') ? `${BACKEND_URL}${imagePath}` : `${BACKEND_URL}/${imagePath}`;
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    setMainImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setMainImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e) => {
    const files = [...e.target.files];
    setGallery(files);
    
    // Create previews
    const previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === files.length) {
          setGalleryPreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading product details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
            <BiPackage className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Product not found</h3>
            <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/admin/dashboard/products')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200"
            >
              {/* <BiArrowLeft className="mr-2" /> */}
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/admin/dashboard/products')}
              className="p-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
            >
              {/* <BiArrowLeft className="text-xl text-gray-600" /> */}
            </button>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
                <BiEdit className="mr-3 text-blue-600" />
                Edit Product
              </h2>
              <p className="text-gray-600 mt-1">Update product information and images</p>
            </div>
          </div>
        </div>

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <BiCheck className="text-green-600 text-xl mr-3" />
              <div>
                <h4 className="text-green-800 font-medium">Product updated successfully!</h4>
                <p className="text-green-600 text-sm">Redirecting to products list...</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleEdit} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 lg:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Product Information</h3>
              
              <div className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BiPackage className="inline mr-2" />
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter product name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <BiDollar className="inline mr-2" />
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="0.00"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <BiCube className="inline mr-2" />
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="0"
                      value={stock}
                      onChange={e => setStock(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BiCategory className="inline mr-2" />
                    Category
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Description
                  </label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Enter product description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Image Uploads */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Product Images</h4>
                  
                  {/* Main Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <BiImage className="inline mr-2" />
                      Main Image (optional - keep current if not changed)
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex-1 relative cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageChange}
                          className="sr-only"
                        />
                        <div className="w-full px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-400 transition-colors duration-200 text-center">
                          <BiImageAdd className="mx-auto text-2xl text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">Click to select new main image</span>
                        </div>
                      </label>
                    </div>
                    {mainImagePreview && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">New image preview:</p>
                        <img src={mainImagePreview} alt="New main preview" className="w-24 h-24 object-cover rounded-xl shadow-md" />
                      </div>
                    )}
                  </div>

                  {/* Gallery Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <BiImageAdd className="inline mr-2" />
                      Gallery Images (optional - add more images)
                    </label>
                    <label className="relative cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryChange}
                        className="sr-only"
                      />
                      <div className="w-full px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-400 transition-colors duration-200 text-center">
                        <BiImageAdd className="mx-auto text-2xl text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to select additional images</span>
                      </div>
                    </label>
                    {galleryPreviews.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">New images preview:</p>
                        <div className="flex gap-2 flex-wrap">
                          {galleryPreviews.map((preview, idx) => (
                            <img key={idx} src={preview} alt={`Gallery preview ${idx}`} className="w-20 h-20 object-cover rounded-xl shadow-md" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <BiLoader className="animate-spin mr-2" />
                        Updating Product...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <BiSave className="mr-2" />
                        Update Product
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Current Images Sidebar */}
          <div className="space-y-6">
            {/* Current Main Image */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BiImage className="mr-2 text-blue-600" />
                Current Main Image
              </h3>
              {product.mainImage ? (
                <div className="relative group">
                  {brokenImages['main'] ? (
                    <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                      <BiImage className="text-4xl text-gray-400" />
                    </div>
                  ) : (
                    <img
                      src={getImageUrl(product.mainImage)}
                      alt="Current main"
                      className="w-full h-48 object-cover rounded-xl shadow-md"
                      onError={() => handleImageError('main')}
                    />
                  )}
                </div>
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                  <div className="text-center">
                    <BiImage className="text-4xl text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No main image</p>
                  </div>
                </div>
              )}
            </div>

            {/* Current Gallery */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BiImageAdd className="mr-2 text-blue-600" />
                Current Gallery ({product.gallery?.length || 0})
              </h3>
              {product.gallery && product.gallery.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {product.gallery.map((img, idx) => (
                    <div key={idx} className="relative group">
                      {brokenImages[`gallery-${idx}`] ? (
                        <div className="w-full h-24 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                          <BiImage className="text-2xl text-gray-400" />
                        </div>
                      ) : (
                        <img
                          src={getImageUrl(img)}
                          alt={`Gallery ${idx}`}
                          className="w-full h-24 object-cover rounded-xl shadow-md"
                          onError={() => handleImageError(`gallery-${idx}`)}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(img)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-lg opacity-0 group-hover:opacity-100"
                        title="Remove image"
                      >
                        <BiTrash className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BiImageAdd className="text-4xl text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No gallery images</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;