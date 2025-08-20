import { useState } from 'react';
import Modal from '../components/Modal';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import { IoCartOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';
import { FaHeart, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleScrollToAbout = () => {
    navigate('/', { state: { scrollTo: 'about-section' } });
  };

  return (
    <>
      {/* Enhanced Navbar with gradient background and better styling */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-white via-rose-50 to-white shadow-lg backdrop-blur-sm dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-serif border-b border-rose-100 dark:border-gray-700">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Enhanced Logo Section */}
            <Link to="/" className="flex items-center space-x-3 group transform transition-transform hover:scale-105">
              <div className="relative">
                <img 
                  src="https://static.vecteezy.com/system/resources/previews/011/144/540/non_2x/jewelry-ring-abstract-logo-template-design-with-luxury-diamonds-or-gems-isolated-on-black-and-white-background-logo-can-be-for-jewelry-brands-and-signs-free-vector.jpg" 
                  className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover ring-2 ring-rose-300 group-hover:ring-rose-500 transition-all duration-300" 
                  alt="Jewelry Logo" 
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Jewellery
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-light tracking-wide hidden sm:block">
                  Luxury Collection
                </span>
              </div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link 
                to="/" 
                className="relative text-gray-700 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-300 font-medium group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-gray-700 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-300 font-medium group"
                >
                  Collections
                  <svg 
                    className={`w-4 h-4 ml-1 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 10 6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l4 4 4-4" />
                  </svg>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              </div>
              
              <button 
                onClick={handleScrollToAbout} 
                className="relative text-gray-700 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-300 font-medium group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </div>

            {/* Enhanced Icons and User Section */}
            <div className="flex items-center space-x-3 md:space-x-4">
              {/* User Icons - Only show if logged in */}
              {user && (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/wishlist" 
                    className="relative p-2 text-rose-500 hover:text-rose-600 transition-all duration-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full group"
                  >
                    {/* <FaHeart className="text-xl" /> */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  </Link>
                  <Link 
                    to="/cart" 
                    className="relative p-2 text-gray-700 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full group"
                  >
                    {/* <IoCartOutline className="text-xl" /> */}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m10-5v6a1 1 0 01-1 1H9a1 1 0 01-1-1v-6m8 0V9a1 1 0 00-1-1H9a1 1 0 00-1 1v4.01" />
                    </svg>
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  </Link>
                </div>
              )}

              {/* Enhanced User Profile or Auth */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  >
                    {user.profilePhoto ? (
                      <div className="relative">
                        <img
                          src={
                            user.profilePhoto.startsWith("http")
                              ? user.profilePhoto
                              : `${BACKEND_URL}${user.profilePhoto}`
                          }
                          alt="Profile"
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-rose-400 hover:border-rose-500 transition-all duration-300"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                      </div>
                    ) : (
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 flex items-center justify-center">
                        {/* <FaUserCircle className="text-2xl text-white" /> */}
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                  
                  {/* Enhanced User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl dark:bg-gray-800 z-50 border border-gray-100 dark:border-gray-700 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                      <div className="py-2">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Welcome back!</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                        
                        <Link to="/orders" className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-white hover:bg-rose-50 dark:hover:bg-gray-700 transition-colors duration-200">
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          My Orders
                        </Link>
                        
                        <Link to="/profile" className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-white hover:bg-rose-50 dark:hover:bg-gray-700 transition-colors duration-200">
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          My Profile
                        </Link>
                        
                        <Link to="/wishlist" className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-white hover:bg-rose-50 dark:hover:bg-gray-700 transition-colors duration-200">
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          My Wishlist
                        </Link>
                        
                        {user?.isAdmin && (
                          <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                            <Link to="/admin/dashboard" className="flex items-center px-4 py-3 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-200">
                              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              Admin Dashboard
                            </Link>
                            <Link to="/admin/dashboard/products" className="flex items-center px-4 py-3 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-200">
                              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                              Manage Products
                            </Link>
                            <Link to="/admin/dashboard/orders" className="flex items-center px-4 py-3 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-200">
                              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              Manage Orders
                            </Link>
                          </div>
                        )}
                        
                        <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                          <button
                            onClick={async () => {
                              await dispatch(logoutUser());
                              setIsUserMenuOpen(false);
                              navigate('/');
                            }}
                            className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setOpenAuthModal(true)}
                  className="px-4 py-2 md:px-6 md:py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-2 focus:ring-rose-400 focus:outline-none"
                >
                  Login / Sign Up
                </button>
              )}

              {/* Enhanced Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-rose-400 focus:outline-none"
              >
                <svg className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Collections Dropdown */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-2xl border-t border-rose-100 dark:border-gray-700 z-40 animate-in slide-in-from-top-4 duration-300">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  ['Bracelets', 'Charm, Cuff, Bangles', '/products?category=Bracelet', '💎'],
                  ['Pendants', 'Elegant, Modern, Stone-studded', '/products?category=Pendant', '✨'],
                  ['Earrings', 'Studs, Hoops, Drops', '/products?category=Earring', '💫'],
                  ['Rings', 'Solitaire, Couple, Statement', '/products?category=Ring', '💍'],
                  ['Necklaces', 'Chains, Chokers, Sets', '/products?category=Necklace', '🌟'],
                  ['Anklets', 'Silver, Gold, Designer', '/products?category=Anklet', '✨'],
                ].map(([title, desc, url, emoji]) => (
                  <Link
                    key={title}
                    to={url}
                    className="group block p-4 rounded-xl hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 border border-transparent hover:border-rose-200 dark:hover:border-gray-600 hover:shadow-lg transform hover:-translate-y-1"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{emoji}</span>
                      <div>
                        <div className="font-semibold text-gray-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-300">
                          {title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                          {desc}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-rose-100 dark:border-gray-700 animate-in slide-in-from-top-4 duration-300">
            <div className="px-4 py-6 space-y-4">
              <Link 
                to="/" 
                className="block px-4 py-3 text-lg font-medium text-gray-700 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 Home
              </Link>
              
              <div className="space-y-2">
                <div className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Collections
                </div>
                {[
                  ['Bracelets', '/products?category=Bracelet', '💎'],
                  ['Pendants', '/products?category=Pendant', '✨'],
                  ['Earrings', '/products?category=Earring', '💫'],
                  ['Rings', '/products?category=Ring', '💍'],
                  ['Necklaces', '/products?category=Necklace', '🌟'],
                  ['Anklets', '/products?category=Anklet', '✨'],
                ].map(([title, url, emoji]) => (
                  <Link
                    key={title}
                    to={url}
                    className="flex items-center px-4 py-3 text-gray-700 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3">{emoji}</span>
                    {title}
                  </Link>
                ))}
              </div>
              
              <button 
                onClick={() => {
                  handleScrollToAbout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-lg font-medium text-gray-700 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300"
              >
                ℹ️ About
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        {currentPage === "login" && (
          <Login setCurrentPage={setCurrentPage} onLoginSuccess={() => setOpenAuthModal(false)} />
        )}
        {currentPage === "signup" && <SignUp setCurrentPage={setCurrentPage} />}
      </Modal>

      {/* Overlay for dropdown/mobile menu */}
      {(isDropdownOpen || isMenuOpen || isUserMenuOpen) && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30" 
          onClick={() => {
            setIsDropdownOpen(false);
            setIsMenuOpen(false);
            setIsUserMenuOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Navbar;