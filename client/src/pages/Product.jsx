import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';

const Product = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoriesFromURL = queryParams.getAll('category');
    if (categoriesFromURL.length > 0) {
      setSelectedCategories(categoriesFromURL);
    } else {
      setSelectedCategories([]);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams(location.search);
        const categoryFilters = queryParams.getAll('category');

        const res = await axiosInstance.get('/api/products', {
          params: { category: categoryFilters },
        });

        setProducts(res.data);
        setSelectedCategories(categoryFilters);
      } catch (err) {
        setError('Failed to load products.');
      }
      setLoading(false);
    };

    fetchFilteredProducts();
  }, [location.search]);

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;

    let updatedCategories = [...selectedCategories];
    if (checked) {
      updatedCategories.push(value);
    } else {
      updatedCategories = updatedCategories.filter((cat) => cat !== value);
    }

    setSelectedCategories(updatedCategories);

    const params = new URLSearchParams(location.search);
    params.delete('category');
    updatedCategories.forEach((cat) => params.append('category', cat));
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const handlePriceChange = (e) => {
    setSelectedPriceRange(e.target.value);
  };

  const filterProducts = () => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());

      const price = product.price;
      let matchesPrice = true;
      switch (selectedPriceRange) {
        case 'under1000':
          matchesPrice = price < 1000;
          break;
        case '1000to3000':
          matchesPrice = price >= 1000 && price <= 3000;
          break;
        case '3000to5000':
          matchesPrice = price > 3000 && price <= 5000;
          break;
        case 'above5000':
          matchesPrice = price > 5000;
          break;
        default:
          matchesPrice = true;
      }

      return matchesSearch && matchesPrice;
    });
  };

  const filteredProducts = filterProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-center text-slate-700 mb-10">
        Our Products
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filter Panel */}
        <aside className="lg:w-1/4 w-full bg-white shadow-sm rounded-xl p-6 space-y-6 sticky top-24 h-fit border border-gray-100">
          <div>
            <h2 className="text-lg font-medium text-slate-700 mb-2">Search</h2>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <h2 className="text-lg font-medium text-slate-700 mb-2">Categories</h2>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <label key={cat} className="block text-sm text-gray-700 mb-1">
                  <input
                    type="checkbox"
                    value={cat}
                    checked={selectedCategories.includes(cat)}
                    onChange={handleCategoryChange}
                    className="mr-2 accent-slate-600"
                  />
                  {cat}
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-400">No categories found.</p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-medium text-slate-700 mb-2">Price</h2>
            {[
              { label: 'Under ₹1000', value: 'under1000' },
              { label: '₹1000 - ₹3000', value: '1000to3000' },
              { label: '₹3000 - ₹5000', value: '3000to5000' },
              { label: 'Above ₹5000', value: 'above5000' },
              { label: 'All', value: '' },
            ].map(({ label, value }) => (
              <label key={value} className="block text-sm text-gray-700 mb-1">
                <input
                  type="radio"
                  name="price"
                  value={value}
                  checked={selectedPriceRange === value}
                  onChange={handlePriceChange}
                  className="mr-2 accent-slate-600"
                />
                {label}
              </label>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <section className="flex-1 px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-6 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Loading products...</div>
          ) : error ? (
            <div className="text-center text-gray-500">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-gray-400">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  to={`/products/${product._id}`}
                  key={product._id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col hover:shadow-md transition-transform hover:-translate-y-1"
                >
                  <div className="w-full h-64 flex items-center justify-center bg-white rounded-t-xl overflow-hidden">
                    <img
                      src={product.mainImage ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.mainImage}` : '/default-product.png'}
                      alt={product.name}
                      className="object-contain h-full"
                    />
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
                      <p className="text-gray-700 font-medium mb-1">₹{product.price}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <button className="mt-4 bg-gray-100 text-gray-800 text-sm py-1 rounded hover:bg-gray-200 transition-colors">
                      View Details
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default Product;
