import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axiosInstance.get(`/api/products/${id}`);
      setProduct(res.data);
      setName(res.data.name);
      setPrice(res.data.price);
      setDescription(res.data.description);
      setCategory(res.data.category);
      setStock(res.data.stock);
    };
    fetchProduct();
  }, [id]);

  const handleEdit = async (e) => {
    e.preventDefault();
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

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleEdit} className="space-y-4 max-w-md">
        <input
          className="w-full border p-2 rounded"
          placeholder="Product Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Price"
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Stock"
          type="number"
          value={stock}
          onChange={e => setStock(e.target.value)}
        />
        <label>Main Image:</label>
        <input
          className="w-full border p-2 rounded"
          type="file"
          accept="image/*"
          onChange={e => setMainImage(e.target.files[0])}
        />
        <label>Gallery Images (add more):</label>
        <input
          className="w-full border p-2 rounded"
          type="file"
          accept="image/*"
          multiple
          onChange={e => setGallery([...e.target.files])}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Update Product
        </button>
        {success && <div className="text-green-600">Product updated!</div>}
      </form>
      <div className="mt-4">
        <h3 className="font-semibold">Current Main Image:</h3>
        {product.mainImage && (
          <img src={BACKEND_URL + product.mainImage} alt="Main" className="w-32 h-32 object-cover rounded" />
        )}
        <h3 className="font-semibold mt-4">Current Gallery:</h3>
        <div className="flex gap-2 flex-wrap">
          {product.gallery?.map((img, idx) => (
            <div key={idx} className="relative">
              <img src={BACKEND_URL + img} alt="Gallery" className="w-20 h-20 object-cover rounded" />
              <button
                type="button"
                onClick={() => handleRemoveGalleryImage(img)}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                title="Remove"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditProduct;