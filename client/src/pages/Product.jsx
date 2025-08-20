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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mb-4">
            Our Products
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Discover our curated collection of premium products tailored just for you
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            <span className="font-medium text-gray-700">Filters</span>
            <svg className={`w-4 h-4 text-gray-500 transition-transform ${isMobileFilterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filter Panel */}
          <aside className={`
            lg:w-1/4 w-full bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 space-y-8
            lg:sticky lg:top-24 lg:h-fit border border-white/20
            ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}
          `}>
            {/* Search Filter */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h2 className="text-lg font-semibold text-slate-700">Search</h2>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Categories Filter */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <h2 className="text-lg font-semibold text-slate-700">Categories</h2>
              </div>
              <div className="space-y-3">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <label key={cat} className="flex items-center group cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          value={cat}
                          checked={selectedCategories.includes(cat)}
                          onChange={handleCategoryChange}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 transition-all ${
                          selectedCategories.includes(cat)
                            ? 'bg-slate-600 border-slate-600'
                            : 'border-gray-300 group-hover:border-slate-400'
                        }`}>
                          {selectedCategories.includes(cat) && (
                            <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-slate-700 font-medium">
                        {cat}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">No categories found.</p>
                )}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <h2 className="text-lg font-semibold text-slate-700">Price Range</h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Under ₹1,000', value: 'under1000' },
                  { label: '₹1,000 - ₹3,000', value: '1000to3000' },
                  { label: '₹3,000 - ₹5,000', value: '3000to5000' },
                  { label: 'Above ₹5,000', value: 'above5000' },
                  { label: 'All Prices', value: '' },
                ].map(({ label, value }) => (
                  <label key={value} className="flex items-center group cursor-pointer">
                    <div className="relative">
                      <input
                        type="radio"
                        name="price"
                        value={value}
                        checked={selectedPriceRange === value}
                        onChange={handlePriceChange}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                        selectedPriceRange === value
                          ? 'bg-slate-600 border-slate-600'
                          : 'border-gray-300 group-hover:border-slate-400'
                      }`}>
                        {selectedPriceRange === value && (
                          <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        )}
                      </div>
                    </div>
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-slate-700 font-medium">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Section */}
          <section className="flex-1">
            {/* Results Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-slate-700">{filteredProducts.length}</span> products
                </span>
                {(selectedCategories.length > 0 || selectedPriceRange || search) && (
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    Filtered
                  </span>
                )}
              </div>
              
              {/* Active Filters */}
              {(selectedCategories.length > 0 || selectedPriceRange || search) && (
                <div className="flex flex-wrap gap-2">
                  {search && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1">
                      Search: "{search}"
                      <button 
                        onClick={() => setSearch('')}
                        className="hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedCategories.map(cat => (
                    <span key={cat} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1">
                      {cat}
                      <button 
                        onClick={() => {
                          const updatedCategories = selectedCategories.filter(c => c !== cat);
                          setSelectedCategories(updatedCategories);
                          const params = new URLSearchParams(location.search);
                          params.delete('category');
                          updatedCategories.forEach((c) => params.append('category', c));
                          navigate(`${location.pathname}?${params.toString()}`, { replace: true });
                        }}
                        className="hover:text-green-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {selectedPriceRange && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center gap-1">
                      Price filter
                      <button 
                        onClick={() => setSelectedPriceRange('')}
                        className="hover:text-purple-900"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mb-4"></div>
                <p className="text-gray-500 text-lg">Loading products...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
                  <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-md text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
                  <p className="text-gray-500 text-sm">Try adjusting your filters or search terms</p>
                </div>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    to={`/products/${product._id}`}
                    key={product._id}
                    className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white overflow-hidden"
                  >
                    {/* Product Image */}
                    <div className="relative w-full h-48 sm:h-56 bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-2xl overflow-hidden">
                      <img
                        src={product.mainImage}
                        alt={product.name}
                        className="object-contain w-full h-full p-4 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col space-y-3">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-slate-700 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 font-medium">
                            {product.category}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-slate-700">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-xs text-gray-500">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Details
                          </div>
                        </div>

                        <button className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white font-medium py-2.5 rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 transform group-hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
                          View Product
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Product;