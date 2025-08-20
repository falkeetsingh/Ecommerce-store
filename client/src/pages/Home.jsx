import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowRight, FaTruck, FaClock, FaMoneyBillWave, FaGift, FaStar, FaHeart, FaShieldAlt } from "react-icons/fa";
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo === 'about-section') {
      const section = document.querySelector('.about-section');
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);
  const navigate = useNavigate();
  const handleScrollToAbout = () => {
    navigate('/', { state: { scrollTo: 'about-section' } });
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-pink-300 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-300 rounded-full blur-lg"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-rose-300 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-pink-700 mb-6 shadow-sm">
            <FaStar className="text-yellow-400" />
            <span>Premium Handcrafted Collection</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent leading-tight">
            Elegance That Lasts
            <span className="block">Forever</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover our exquisite collection of handcrafted jewelry, where timeless beauty meets modern elegance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/products" 
              className="group px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Shop Collection
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <button
              onClick={handleScrollToAbout}  
              className="px-8 py-4 border-2 border-pink-200 text-pink-700 rounded-full font-semibold hover:bg-pink-50 transition-all duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Explore Our Collections
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each piece tells a story of craftsmanship and elegance
            </p>
          </div>

          {/* Desktop and Tablet Layout */}
          <div className="hidden md:grid md:grid-cols-2 gap-6 h-[600px]">
            {/* Large Bracelets Card */}
            <div className="relative group overflow-hidden rounded-3xl shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700"></div>
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Content */}
              <div className="relative h-full flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-3xl font-bold mb-2">Bracelets</h3>
                  <p className="text-white/80 mb-4">Elegant wrist companions</p>
                  <Link 
                    to="/products?category=Bracelet"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-semibold hover:bg-white/30 transition-all duration-300 group-hover:transform group-hover:translate-y-0 transform translate-y-2"
                  >
                    Explore Collection
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-6 right-6 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute top-20 right-20 w-12 h-12 bg-white/10 rounded-full blur-lg"></div>
            </div>

            {/* Right Column - Pendants and Earrings */}
            <div className="flex flex-col gap-6">
              {/* Pendants Card */}
              <div className="relative group overflow-hidden rounded-3xl shadow-xl flex-1">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700"></div>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <div className="relative h-full flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">Pendants</h3>
                    <p className="text-white/80 mb-3">Graceful neck pieces</p>
                    <Link 
                      to="/products?category=Pendant"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-medium hover:bg-white/30 transition-all duration-300"
                    >
                      Shop Now
                      <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
                
                <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
              </div>

              {/* Earrings Card */}
              <div className="relative group overflow-hidden rounded-3xl shadow-xl flex-1">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-600 to-red-700"></div>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <div className="relative h-full flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">Earrings</h3>
                    <p className="text-white/80 mb-3">Stunning ear adornments</p>
                    <Link 
                      to="/products?category=Earring"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-medium hover:bg-white/30 transition-all duration-300"
                    >
                      Shop Now
                      <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
                
                <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="grid grid-cols-1 gap-6 md:hidden">
            {/* Bracelets */}
            <div className="relative group overflow-hidden rounded-2xl shadow-lg h-64">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              <div className="relative h-full flex items-end p-6">
                <div className="text-white w-full">
                  <h3 className="text-2xl font-bold mb-2">Bracelets</h3>
                  <p className="text-white/80 mb-4">Elegant wrist companions</p>
                  <Link 
                    to="/products?category=Bracelet"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-medium hover:bg-white/30 transition-all duration-300"
                  >
                    Shop Now
                    <FaArrowRight className="text-sm" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Pendants */}
            <div className="relative group overflow-hidden rounded-2xl shadow-lg h-64">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              <div className="relative h-full flex items-end p-6">
                <div className="text-white w-full">
                  <h3 className="text-2xl font-bold mb-2">Pendants</h3>
                  <p className="text-white/80 mb-4">Graceful neck pieces</p>
                  <Link 
                    to="/products?category=Pendant"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-medium hover:bg-white/30 transition-all duration-300"
                  >
                    Shop Now
                    <FaArrowRight className="text-sm" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Earrings */}
            <div className="relative group overflow-hidden rounded-2xl shadow-lg h-64">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-pink-600"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              <div className="relative h-full flex items-end p-6">
                <div className="text-white w-full">
                  <h3 className="text-2xl font-bold mb-2">Earrings</h3>
                  <p className="text-white/80 mb-4">Stunning ear adornments</p>
                  <Link 
                    to="/products?category=Earring"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-medium hover:bg-white/30 transition-all duration-300"
                  >
                    Shop Now
                    <FaArrowRight className="text-sm" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* View All Products Button */}
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span>View All Products</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-gray-600">Experience excellence in every detail</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FaTruck,
                title: "Free Shipping",
                description: "Free delivery on orders above ₹2000",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: FaClock,
                title: "24/7 Support",
                description: "Round-the-clock customer assistance",
                gradient: "from-purple-500 to-indigo-500"
              },
              {
                icon: FaShieldAlt,
                title: "Easy Returns",
                description: "30-day hassle-free return policy",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: FaHeart,
                title: "Member Benefits",
                description: "Exclusive discounts for loyal customers",
                gradient: "from-pink-500 to-rose-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center h-full">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white about-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              About Our Story
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-full text-pink-700 font-medium text-sm">
                <FaStar className="text-yellow-500" />
                <span>Crafting Excellence Since 2010</span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Timeless Beauty, Handcrafted with Love
              </h3>
              
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Our journey began with a simple vision: to create jewelry that tells a story. Each piece in our collection is meticulously handcrafted by skilled artisans who pour their passion and expertise into every detail.
                </p>
                <p>
                  From the selection of the finest materials to the final polish, we maintain the highest standards of quality and craftsmanship. Our commitment to excellence has made us a trusted name in luxury jewelry.
                </p>
                <p>
                  We believe that jewelry is more than just an accessory – it's a reflection of your personality, a celebration of life's precious moments, and a legacy that can be passed down through generations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-1">10K+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-1">50+</div>
                  <div className="text-gray-600">Unique Designs</div>
                </div>
              </div>
            </div>

            {/* Image/Visual */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100 rounded-3xl shadow-xl overflow-hidden">
                <div className="aspect-[4/5] flex items-center justify-center text-gray-400 text-xl font-medium">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaHeart className="text-3xl text-white" />
                    </div>
                    <p>Crafted with Love</p>
                    <p className="text-sm text-gray-400 mt-2">Premium Image Placeholder</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;